import {autobind, debounce} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, PropTypes, PureComponent} from 'react'
import _debounce from 'lodash/debounce'
import CSSModules from 'react-css-modules'

import {
  genBookmarkList,
  getBookmark,
  getBookmarkType,
  getClickType,
  getFlatTree,
  getSearchResult,
  getSlicedTrees,
  isFolder,
  openBookmark,
  setPredefinedStyleSheet,
  updateLastUsedTreeIds
} from '../functions'
import {
  removeTreeInfosFromIndex,
  replaceTreeInfoByIndex,
  updateEditorTarget,
  updateFocusTarget,
  updateMenuTarget,
  updateMousePosition,
  updateTrees
} from '../actions'
import {
  TYPE_ROOT_FOLDER
} from '../constants'
import Editor from '../components/Editor'
import Menu from '../components/Menu'
import MenuCover from '../components/MenuCover'
import Panel from '../components/Panel'

import styles from '../../../css/popup/app.css'

class App extends PureComponent {
  componentWillMount() {
    const {options} = this.props

    setPredefinedStyleSheet(options)
  }

  componentDidMount() {
    this.initBookmarkEvent()
  }

  componentDidUpdate(prevProps) {
    const {
      options,
      searchKeyword,
      trees
    } = this.props

    const isRememberLastPosition = options.rememberPos && !searchKeyword
    if (isRememberLastPosition && trees !== prevProps.trees) {
      updateLastUsedTreeIds(trees)
    }
  }

  getFocusTargetTreeIndex() {
    const {
      focusTarget,
      trees
    } = this.props

    if (!focusTarget) {
      return trees.length - 1
    }

    if (getBookmarkType(focusTarget) === TYPE_ROOT_FOLDER) {
      return 0
    }

    const matchedIndex = trees.findIndex((treeInfo) => treeInfo.id === focusTarget.parentId)

    if (matchedIndex < 0) {
      return trees.length - 1
    }

    return matchedIndex
  }

  handleContextMenu(evt) {
    // allow native context menu if it is an input element
    if (evt.target.tagName === 'INPUT') {
      return
    }

    // disable native context menu
    evt.preventDefault()
  }

  async handleEnter(evt) {
    const {
      focusTarget,
      searchKeyword,
      options,
      trees
    } = this.props

    let itemInfo
    if (focusTarget) {
      itemInfo = focusTarget
    } else if (searchKeyword) {
      itemInfo = trees[0].children[0]
    }

    if (itemInfo) {
      const clickType = getClickType(evt)
      await openBookmark(itemInfo, clickType, options)
    }
  }

  @autobind
  handleKeyDown(evt) {
    evt.persist()

    const {
      editorTarget,
      menuTarget
    } = this.props

    if (!editorTarget && !menuTarget) {
      // preventDefault here because default operation may run before debounced/async function
      switch (evt.keyCode) {
        case 9: // tab
        case 38: // up
        case 40: // down
          evt.preventDefault()
          break

        default:
      }

      this._handleKeyDown(evt)
    }
  }

  @debounce(30)
  async _handleKeyDown(evt) {
    switch (evt.keyCode) {
      case 9: // tab
        await this.keyboardArrowUpDownHandler(evt.shiftKey)
        break

      case 13: // enter
        await this.handleEnter(evt)
        break

      case 37: // left
        await this.keyboardArrowLeftRightHandler(true)
        break

      case 38: // up
        await this.keyboardArrowUpDownHandler(true)
        break

      case 39: // right
        await this.keyboardArrowLeftRightHandler(false)
        break

      case 40: // down
        await this.keyboardArrowUpDownHandler(false)
        break

      case 91: // command
      case 93: // command
        this.triggerContextMenu()
        break

      default:
    }
  }

  handleMouseDown(evt) {
    // disable the scrolling arrows after middle click
    if (evt.button === 1) {
      evt.preventDefault()
    }
  }

  initBookmarkEvent() {
    const renewCurrentTrees = () => renewTrees(this.props.trees)

    const renewSlicedTreesById = (itemId) => {
      const {trees} = this.props

      const removeFromIndex = trees.findIndex((treeInfo) => treeInfo.id === itemId)

      if (removeFromIndex >= 0) {
        const slicedTrees = getSlicedTrees(trees, removeFromIndex)

        renewTrees(slicedTrees)
      } else {
        renewCurrentTrees()
      }
    }

    const renewTrees = _debounce(async (oldTrees) => {
      const {
        dispatch,
        options,
        searchKeyword
      } = this.props

      const newTrees = await Promise.all(oldTrees.asMutable().map((treeInfo) => {
        if (treeInfo.id === 'search-result') {
          return getSearchResult(searchKeyword, options)
        }

        return getFlatTree(treeInfo.id)
      }))

      dispatch([
        // to make sure the menu is not activated when bookmark is updating
        updateEditorTarget(null),
        updateMenuTarget(null),

        updateTrees(newTrees)
      ])
    }, 100)

    chrome.bookmarks.onChanged.addListener(renewCurrentTrees)
    chrome.bookmarks.onCreated.addListener(renewCurrentTrees)
    chrome.bookmarks.onMoved.addListener(renewSlicedTreesById)
    chrome.bookmarks.onRemoved.addListener(renewSlicedTreesById)
  }

  async keyboardArrowLeftRightHandler(isLeft) {
    const {
      dispatch,
      editorTarget,
      focusTarget,
      menuTarget,
      rootTree,
      searchKeyword,
      trees
    } = this.props

    if (editorTarget || menuTarget) return

    const targetTreeIndex = this.getFocusTargetTreeIndex()

    if (isLeft) {
      // at least we need one tree
      if (trees.length > 1) {
        const targetTree = trees[targetTreeIndex]

        const targetTreeItemInfo = await getBookmark(targetTree.id)

        dispatch([
          removeTreeInfosFromIndex(targetTreeIndex),
          updateFocusTarget(targetTreeItemInfo)
        ])
      }
    } else {
      if (focusTarget && isFolder(focusTarget)) {
        const nextTreeIndex = targetTreeIndex + 1
        const nextTreeInfo = await getFlatTree(focusTarget.id)

        const nextBookmarkList = genBookmarkList(nextTreeInfo, {
          isSearching: Boolean(searchKeyword),
          rootTree,
          treeIndex: nextTreeIndex
        })

        dispatch([
          await replaceTreeInfoByIndex(nextTreeIndex, nextTreeInfo),
          updateFocusTarget(nextBookmarkList[0])
        ])
      }
    }
  }

  async keyboardArrowUpDownHandler(isUp) {
    const {
      dispatch,
      editorTarget,
      focusTarget,
      menuTarget,
      rootTree,
      searchKeyword,
      trees
    } = this.props

    if (editorTarget || menuTarget) return

    const targetTreeIndex = this.getFocusTargetTreeIndex()

    const targetBookmarkList = genBookmarkList(trees[targetTreeIndex], {
      isSearching: Boolean(searchKeyword),
      rootTree,
      treeIndex: targetTreeIndex
    })

    const lastItemIndex = targetBookmarkList.length - 1

    let nextSelectedIndex
    if (focusTarget) {
      const origSelectedIndex = targetBookmarkList
        .findIndex((itemInfo) => itemInfo.id === focusTarget.id)

      if (isUp) {
        nextSelectedIndex = origSelectedIndex - 1
        if (nextSelectedIndex < 0) {
          nextSelectedIndex = lastItemIndex
        }
      } else {
        nextSelectedIndex = origSelectedIndex + 1
        if (nextSelectedIndex > lastItemIndex) {
          nextSelectedIndex = 0
        }
      }
    } else {
      nextSelectedIndex = isUp ? lastItemIndex : 0
    }

    dispatch(updateFocusTarget(targetBookmarkList[nextSelectedIndex]))
  }

  triggerContextMenu() {
    const {
      dispatch,
      focusTarget
    } = this.props

    const actions = []

    const el = document.getElementById(focusTarget.id)
    if (el) {
      const elOffset = el.getBoundingClientRect()

      actions.push(
        updateMousePosition({
          x: elOffset.left,
          y: elOffset.top
        })
      )
    }

    dispatch([
      ...actions,
      updateMenuTarget(focusTarget)
    ])
  }

  render() {
    console.log('render')

    return (
      <div
        styleName='main'
        onContextMenu={this.handleContextMenu}
        onKeyDown={this.handleKeyDown}
        onMouseDown={this.handleMouseDown}
      >
        <Panel />
        <MenuCover />
        <Menu />
        <Editor />
      </div>
    )
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  editorTarget: PropTypes.object,
  focusTarget: PropTypes.object,
  menuTarget: PropTypes.object,
  options: PropTypes.object.isRequired,
  rootTree: PropTypes.object.isRequired,
  searchKeyword: PropTypes.string.isRequired,
  trees: PropTypes.arrayOf(PropTypes.object).isRequired
}

const mapStateToProps = (state) => ({
  editorTarget: state.editorTarget,
  focusTarget: state.focusTarget,
  menuTarget: state.menuTarget,
  options: state.options,
  rootTree: state.rootTree,
  searchKeyword: state.searchKeyword,
  trees: state.trees
})

export default connect(mapStateToProps)(
  CSSModules(App, styles)
)
