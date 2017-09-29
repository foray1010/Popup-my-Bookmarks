import debounce from 'lodash.debounce'
import PropTypes from 'prop-types'
import R from 'ramda'
import {createElement, PureComponent} from 'react'

import chromep from '../../../common/lib/chromePromise'
import Main from './Main'
import {
  getClickType,
  getSlicedTrees,
  openBookmark,
  setPredefinedStyleSheet,
  tryFocusToSearchInput,
  updateLastUsedTreeIds
} from '../../functions'

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
    const {isSearching, options, trees} = this.props

    if (trees !== prevProps.trees) {
      const isRememberLastPosition = options.rememberPos && !isSearching
      if (isRememberLastPosition) {
        updateLastUsedTreeIds(trees)
      }
    }
  }

  handleContextMenu = (evt) => {
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
  handleDragEnd = async () => {
    const {dragEnd, dragIndicator, dragTarget} = this.props

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

  handleEnter = async (evt) => {
    const {focusTarget, isSearching, menuTarget, options, selectedMenuItem, trees} = this.props

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

  handleKeyDown = async (evt) => {
    const {closeMenu, editorTarget, focusTarget, menuTarget, openMenu} = this.props

    // no custom handle for editor
    if (editorTarget) return

    const {keyCode} = evt
    switch (keyCode) {
      case 9: // tab
      case 37: // left
      case 38: // up
      case 39: // right
      case 40: {
        // down
        const mapping = R.cond([
          [R.equals(9), R.always(evt.shiftKey ? 'up' : 'down')],
          [R.equals(37), R.always('left')],
          [R.equals(38), R.always('up')],
          [R.equals(39), R.always('right')],
          [R.equals(40), R.always('down')]
        ])

        evt.preventDefault()
        this.keyboardArrowHandler(mapping(keyCode))
        break
      }

      case 13: // enter
        if (evt.repeat) return

        evt.preventDefault()
        this.handleEnter(evt)
        break

      case 17: // ctrl
      case 91: // menu
      case 93: {
        // menu
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

      default:
        tryFocusToSearchInput()
    }
  }

  handleMouseDown = (evt) => {
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

    const renewTrees = debounce(this.props.renewTrees, 100)

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

  keyboardArrowHandler = debounce((arrowDirection) => {
    const {onPressArrowKey} = this.props

    onPressArrowKey(arrowDirection)
  }, 30)

  render() {
    return <Main />
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
