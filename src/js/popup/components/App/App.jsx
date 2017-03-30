import {autobind, debounce} from 'core-decorators'
import {createElement, PropTypes, PureComponent} from 'react'
import _debounce from 'lodash/debounce'

import {
  getClickType,
  getSlicedTrees,
  openBookmark,
  setPredefinedStyleSheet,
  tryFocusToSearchInput,
  updateLastUsedTreeIds
} from '../../functions'
import chromep from '../../../common/lib/chromePromise'
import Main from './Main'

class App extends PureComponent {
  componentWillMount() {
    const {options} = this.props

    setPredefinedStyleSheet(options)
  }

  componentDidMount() {
    this.initGlobalEvents()
    this.initBookmarkEvent()
  }

  componentDidUpdate(prevProps) {
    const {
      isSearching,
      options,
      trees
    } = this.props

    if (trees !== prevProps.trees) {
      const isRememberLastPosition = options.rememberPos && !isSearching
      if (isRememberLastPosition) {
        updateLastUsedTreeIds(trees)
      }
    }
  }

  handleContextMenu(evt) {
    // allow native context menu if it is an input element
    if (evt.target.tagName === 'INPUT') {
      return
    }

    // disable native context menu
    evt.preventDefault()
  }

  // hack to stimulate onDragEnd event
  // onDragEnd doesn't work when original drag element is removed from DOM,
  // but onMouseUp still fire
  @autobind
  async handleDragEnd() {
    const {
      dragEnd,
      dragIndicator,
      dragTarget
    } = this.props

    if (dragTarget) {
      if (dragIndicator) {
        await chromep.bookmarks.move(dragTarget.id, {
          parentId: dragIndicator.parentId,
          index: dragIndicator.index
        })
      }

      dragEnd()
    }
  }

  async handleEnter(evt) {
    const {
      focusTarget,
      isSearching,
      menuTarget,
      options,
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
      } else if (isSearching) {
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
      isSearching,
      menuTarget,
      openMenu
    } = this.props

    // no custom handle for editor
    if (editorTarget) return

    const {keyCode} = evt
    switch (keyCode) {
      case 9: // tab
      case 38: // up
      case 40: { // down
        const mapping = {
          9: evt.shiftKey ? 'up' : 'down',
          38: 'up',
          40: 'down'
        }

        evt.preventDefault()
        this.keyboardArrowHandler(mapping[keyCode])
        break
      }

      case 13: // enter
        if (evt.repeat) return

        evt.preventDefault()
        this.handleEnter(evt)
        break

      case 17: // ctrl
      case 91: // menu
      case 93: { // menu
        if (evt.repeat) return

        const isMac = /^Mac/.test(window.navigator.platform)
        const isMenuKey = [91, 93].includes(keyCode)
        if (isMac === isMenuKey) return

        evt.preventDefault()
        if (menuTarget) {
          closeMenu()
        } else if (focusTarget) {
          openMenu(focusTarget)
        }
        break
      }

      case 37: // left
      case 39: { // right
        if (isSearching) return

        const mapping = {
          37: 'left',
          39: 'right'
        }

        evt.preventDefault()
        this.keyboardArrowHandler(mapping[keyCode])
        break
      }

      default:
        tryFocusToSearchInput()
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

  initGlobalEvents() {
    const html = document.documentElement
    html.addEventListener('contextmenu', this.handleContextMenu)
    html.addEventListener('keydown', this.handleKeyDown)
    html.addEventListener('mousedown', this.handleMouseDown)
    html.addEventListener('mouseup', this.handleDragEnd)
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
  dragEnd: PropTypes.func.isRequired,
  dragIndicator: PropTypes.object,
  dragTarget: PropTypes.object,
  editorTarget: PropTypes.object,
  focusTarget: PropTypes.object,
  isSearching: PropTypes.bool.isRequired,
  menuTarget: PropTypes.object,
  onPressArrowKey: PropTypes.func.isRequired,
  openMenu: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  renewTrees: PropTypes.func.isRequired,
  selectedMenuItem: PropTypes.string,
  trees: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default App
