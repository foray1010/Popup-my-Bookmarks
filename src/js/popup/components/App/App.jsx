import {autobind, debounce} from 'core-decorators'
import {createElement, PropTypes, PureComponent} from 'react'
import _debounce from 'lodash/debounce'

import {
  getClickType,
  getSlicedTrees,
  openBookmark,
  setPredefinedStyleSheet,
  updateLastUsedTreeIds
} from '../../functions'
import {
  requestAnimationFrame
} from '../../../common/lib/decorators'
import Main from './Main'

class App extends PureComponent {
  componentWillMount() {
    const {options} = this.props

    setPredefinedStyleSheet(options)
  }

  componentDidMount() {
    this.afterMount()
    this.initBookmarkEvent()
  }

  componentDidUpdate(prevProps) {
    const {
      options,
      searchKeyword,
      trees
    } = this.props

    if (trees !== prevProps.trees) {
      const isRememberLastPosition = options.rememberPos && !searchKeyword
      if (isRememberLastPosition) {
        updateLastUsedTreeIds(trees)
      }
    }
  }

  @requestAnimationFrame
  afterMount() {
    const body = document.body
    body.addEventListener('contextmenu', this.handleContextMenu)
    body.addEventListener('keydown', this.handleKeyDown)
    body.addEventListener('mousedown', this.handleMouseDown)
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
      menuTarget,
      options,
      searchKeyword,
      selectedMenuItem,
      trees
    } = this.props

    if (menuTarget) {
      if (selectedMenuItem) {
        const el = document.getElementById(selectedMenuItem)
        if (el) el.click()
      }
    } else {
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
  }

  @autobind
  handleKeyDown(evt) {
    const {
      closeMenu,
      editorTarget,
      focusTarget,
      menuTarget,
      openMenu
    } = this.props

    // no custom handle for editor
    if (editorTarget) return

    switch (evt.keyCode) {
      case 9: // tab
      case 37: // left
      case 38: // up
      case 39: // right
      case 40: { // down
        const mapping = {
          9: evt.shiftKey ? 'up' : 'down',
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down'
        }

        evt.preventDefault()
        this.keyboardArrowHandler(mapping[evt.keyCode])
        break
      }

      case 13: // enter
        evt.preventDefault()
        this.handleEnter(evt)
        break

      case 17: // ctrl
      case 91: // command
      case 93: { // command
        const isMac = /^Mac/.test(window.navigator.platform)
        const isCtrlKey = evt.keyCode === 17
        if (isMac && !isCtrlKey) return

        evt.preventDefault()
        if (menuTarget) {
          closeMenu()
        } else if (focusTarget) {
          openMenu(focusTarget)
        }
        break
      }

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

    const renewTrees = _debounce(this.props.renewTrees, 100)

    chrome.bookmarks.onChanged.addListener(renewCurrentTrees)
    chrome.bookmarks.onCreated.addListener(renewCurrentTrees)
    chrome.bookmarks.onMoved.addListener(renewSlicedTreesById)
    chrome.bookmarks.onRemoved.addListener(renewSlicedTreesById)
  }

  @debounce(30)
  keyboardArrowHandler(arrowDirection) {
    const {
      onPressArrowKey
    } = this.props

    onPressArrowKey(arrowDirection)
  }

  render() {
    return (
      <Main />
    )
  }
}

App.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  editorTarget: PropTypes.object,
  focusTarget: PropTypes.object,
  menuTarget: PropTypes.object,
  onPressArrowKey: PropTypes.func.isRequired,
  openMenu: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  renewTrees: PropTypes.func.isRequired,
  searchKeyword: PropTypes.string.isRequired,
  selectedMenuItem: PropTypes.string,
  trees: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default App
