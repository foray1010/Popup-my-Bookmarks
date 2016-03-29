import {autobind, debounce} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'
import classNames from 'classnames'

import {
  getBookmarkType,
  getFlatTree,
  isFolder,
  isFolderOpened,
  isItemInView,
  openMultipleBookmarks,
  openOptionsPage
} from '../functions'
import {
  putDragIndicator,
  removeDragIndicator,
  replaceTreeInfoByIndex,
  removeTreeInfosFromIndex,
  updateDragTarget,
  updateMenuTarget,
  updateMousePosition
} from '../actions'
import {
  TYPE_BOOKMARK,
  TYPE_FOLDER,
  TYPE_NO_BOOKMARK,
  TYPE_ROOT_FOLDER,
  TYPE_SEPARATOR
} from '../constants'
import chromep from '../../lib/chromePromise'

const dragHackEl = document.getElementById('drag-hack')
const msgAlertBookmarklet = chrome.i18n.getMessage('alert_bookmarklet')

class BookmarkItem extends Component {
  constructor() {
    super()

    this.openMultipleBookmarks = openMultipleBookmarks.bind(this)
  }

  componentDidMount() {
    this.afterRender()
  }

  shouldComponentUpdate(nextProps) {
    const propNames = [
      'isGreyItem',
      'isKeepInView',
      'isSelected',
      'itemInfo',
      'searchKeyword'
    ]

    return propNames.some((propName) => this.props[propName] !== nextProps[propName])
  }

  componentDidUpdate() {
    const {
      isKeepInView
    } = this.props

    this.afterRender()

    const {baseEl} = this
    if (isKeepInView && !isItemInView(baseEl)) {
      baseEl.scrollIntoView(false)
    }
  }

  getOpenBookmarkHandlerId(evt) {
    const {options} = this.props

    const mouseButton = evt.button

    let switcher

    if (mouseButton === 0) {
      if (evt.ctrlKey || evt.metaKey) {
        switcher = 'clickByLeftCtrl'
      } else if (evt.shiftKey) {
        switcher = 'clickByLeftShift'
      } else {
        switcher = 'clickByLeft'
      }
    } else {
      switcher = 'clickByMiddle'
    }

    return options[switcher]
  }

  async getTooltip() {
    const {
      itemInfo,
      options,
      searchKeyword
    } = this.props

    const tooltipArr = []

    if (options.tooltip) {
      tooltipArr.push(itemInfo.title, itemInfo.url)
    }

    if (searchKeyword) {
      const breadcrumbArr = []

      const getBreadcrumb = async (breadId) => {
        const results = await chromep.bookmarks.get(breadId)

        const thisItemInfo = results[0]

        breadcrumbArr.unshift(thisItemInfo.title)

        if (thisItemInfo.parentId === '0') {
          tooltipArr.unshift(breadcrumbArr.join(' > '))
        } else {
          await getBreadcrumb(thisItemInfo.parentId)
        }
      }

      await getBreadcrumb(itemInfo.parentId)
    }

    return tooltipArr.join('\n')
  }

  afterRender() {
    window.requestAnimationFrame(async () => {
      const {itemInfo} = this.props

      const bookmarkType = getBookmarkType(itemInfo)

      if (bookmarkType === TYPE_BOOKMARK) {
        const {baseEl} = this
        const tooltip = await this.getTooltip()

        if (baseEl && tooltip) {
          baseEl.title = tooltip
        }
      }
    })
  }

  @autobind
  async handleClick(evt) {
    evt.preventDefault()
    evt.persist()

    const {
      dispatch,
      itemInfo,
      options,
      treeIndex,
      trees
    } = this.props

    const bookmarkType = getBookmarkType(itemInfo)

    switch (bookmarkType) {
      case TYPE_ROOT_FOLDER:
      case TYPE_FOLDER:
        if (evt.button === 0) {
          if (options.opFolderBy) {
            if (!isFolderOpened(trees, itemInfo)) {
              dispatch(await this.openFolder())
            } else {
              dispatch(removeTreeInfosFromIndex(treeIndex + 1))
            }
          }
        } else {
          this.openMultipleBookmarks(itemInfo, 0)
        }
        break

      case TYPE_SEPARATOR:
      case TYPE_BOOKMARK: {
        const handlerId = this.getOpenBookmarkHandlerId(evt)
        await this.openBookmark(handlerId)
        break
      }

      default:
    }
  }

  @autobind
  handleContextMenu(evt) {
    // disable native context menu
    evt.preventDefault()

    const {
      dispatch,
      itemInfo
    } = this.props

    dispatch([
      updateMousePosition({
        x: evt.clientX,
        y: evt.clientY
      }),
      updateMenuTarget(itemInfo)
    ])
  }

  @autobind
  async handleDragEnd() {
    const {
      dispatch,
      dragIndicator,
      dragTarget
    } = this.props

    // because we move the original dragTargetEl to #drag-hack
    // the original dragTargetEl cannot be updated by react, so the model will not be updated
    // that's why we need to store the updated context in currentContext
    // const {dragIndicator, dragTarget} = currentContext

    // remove cached dragTargetEl
    dragHackEl.innerHTML = ''

    if (dragIndicator) {
      await chromep.bookmarks.move(dragTarget.id, {
        parentId: dragIndicator.parentId,
        index: dragIndicator.index
      })
    }

    dispatch([
      removeDragIndicator(),
      updateDragTarget(null)
    ])
  }

  @autobind
  handleDragEnter(evt) {
    evt.persist()

    this._handleDragEnter(evt)
  }

  @debounce(50)
  async _handleDragEnter(evt) {
    const {
      dispatch,
      dragTarget,
      itemInfo,
      itemOffsetHeight,
      treeIndex
    } = this.props

    const actionList = []
    const isDragTarget = dragTarget.id === itemInfo.id
    const isPlaceAfter = evt.offsetY > itemOffsetHeight / 2

    const shouldRemoveDragIndicator = (() => {
      const isSiblingOfDragTarget = (
        dragTarget.parentId === itemInfo.parentId &&
        Math.abs(dragTarget.index - itemInfo.index) === 1
      )

      if (isSiblingOfDragTarget) {
        const isDragTargetAfterItemInfo = dragTarget.index - itemInfo.index > 0

        if (isPlaceAfter) {
          return isDragTargetAfterItemInfo
        } else {
          return !isDragTargetAfterItemInfo
        }
      }

      return (
        isDragTarget ||
        getBookmarkType(itemInfo) === TYPE_ROOT_FOLDER
      )
    })()

    // item cannot be the parent folder of itself
    if (!isDragTarget && isFolder(itemInfo)) {
      actionList.push(await this.openFolder())
    } else {
      actionList.push(removeTreeInfosFromIndex(treeIndex + 1))
    }

    if (shouldRemoveDragIndicator) {
      actionList.push(removeDragIndicator())
    } else {
      actionList.push(putDragIndicator(itemInfo, isPlaceAfter))
    }

    dispatch(actionList)
  }

  @autobind
  handleDragStart() {
    const {
      dispatch,
      itemInfo,
      treeIndex
    } = this.props

    // hack to prevent dragover and dragend event stop working when dragTargetEl is removed
    setTimeout(() => {
      const dragTargetEl = this.baseEl

      // create a cloned dragged item to replace the original one
      const clonedDragTargetEl = dragTargetEl.cloneNode(true)
      dragTargetEl.parentNode.insertBefore(clonedDragTargetEl, dragTargetEl)

      // move the original one to #drag-hack
      // it can prevent dragged item from removing by removeTreeInfosFromIndex,
      // which stop dragend event from firing
      dragHackEl.appendChild(dragTargetEl)

      dispatch([
        removeTreeInfosFromIndex(treeIndex + 1),
        updateDragTarget(itemInfo)
      ])
    })
  }

  @autobind
  handleMouse(evt) {
    evt.persist()

    this._handleMouse(evt)
  }

  @debounce(200)
  async _handleMouse(evt) {
    const {
      dispatch,
      itemInfo,
      options,
      searchKeyword,
      treeIndex,
      trees
    } = this.props

    switch (evt.type) {
      case 'mouseenter':
        if (!searchKeyword && !options.opFolderBy) {
          if (isFolder(itemInfo)) {
            if (!isFolderOpened(trees, itemInfo)) {
              dispatch(await this.openFolder())
            }
          } else {
            dispatch(removeTreeInfosFromIndex(treeIndex + 1))
          }
        }
        break

      case 'mouseleave':
        break

      default:
    }
  }

  async openBookmark(handlerId) {
    const {
      itemInfo,
      options
    } = this.props

    const itemUrl = itemInfo.url

    switch (handlerId) {
      case 0: // current tab
      case 1: // current tab (w/o closing PmB)
        if (itemUrl.startsWith('javascript:')) {
          if (options.bookmarklet) {
            await chromep.tabs.executeScript(null, {code: itemUrl})
          } else if (window.confirm(msgAlertBookmarklet)) {
            await openOptionsPage()
          }
        } else {
          await chromep.tabs.update({url: itemUrl})
        }

        break

      case 2: // new tab
      case 3: // background tab
      case 4: // background tab (w/o closing PmB)
        await chromep.tabs.create({
          url: itemUrl,
          active: handlerId === 2
        })
        break

      case 5: // new window
      case 6: // incognito window
        await chromep.windows.create({
          url: itemUrl,
          incognito: handlerId === 6
        })
        break

      default:
    }

    // if not (w/o closing PmB)
    if (handlerId !== 1 && handlerId !== 4) {
      window.close()
    }
  }

  async openFolder() {
    const {
      itemInfo,
      treeIndex
    } = this.props

    const nextTreeIndex = treeIndex + 1
    const treeInfo = await getFlatTree(itemInfo.id)

    return replaceTreeInfoByIndex(nextTreeIndex, treeInfo)
  }

  render() {
    const {
      isGreyItem,
      isSelected,
      itemInfo,
      searchKeyword
    } = this.props

    const bookmarkType = getBookmarkType(itemInfo)
    const itemClassName = classNames(
      'item',
      'bookmark-item',
      bookmarkType,
      {
        'grey-item': isGreyItem,
        selected: isSelected
      }
    )
    const itemTitle = itemInfo.title || itemInfo.url || null

    let iconSrc = null
    switch (bookmarkType) {
      case TYPE_ROOT_FOLDER:
      case TYPE_FOLDER:
        iconSrc = '/img/folder.png'
        break

      case TYPE_BOOKMARK:
        iconSrc = `chrome://favicon/${itemInfo.url}`
        break

      default:
    }

    let isDraggable = true
    switch (bookmarkType) {
      case TYPE_NO_BOOKMARK:
      case TYPE_ROOT_FOLDER:
        isDraggable = false
        break

      default:
        if (searchKeyword) {
          isDraggable = false
        }
    }

    return (
      <li
        ref={(ref) => {
          this.baseEl = ref
        }}
        id={itemInfo.id}
        draggable={isDraggable}
        onDragEnd={this.handleDragEnd}
        onDragEnter={this.handleDragEnter}
        onDragStart={this.handleDragStart}
      >
        <a
          className={itemClassName}
          href={itemInfo.url || '#'}
          draggable={false}
          onClick={this.handleClick}
          onContextMenu={this.handleContextMenu}
          onMouseEnter={this.handleMouse}
          onMouseLeave={this.handleMouse}
        >
          <img className='icon' src={iconSrc} alt='' draggable={false} />
          <span className='no-text-overflow'>{itemTitle}</span>
        </a>
      </li>
    )
  }
}

if (process.env.NODE_ENV !== 'production') {
  BookmarkItem.propTypes = {
    dispatch: PropTypes.func.isRequired,
    dragIndicator: PropTypes.object,
    dragTarget: PropTypes.object,
    isGreyItem: PropTypes.bool.isRequired,
    isKeepInView: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    itemInfo: PropTypes.object.isRequired,
    itemOffsetHeight: PropTypes.number.isRequired,
    options: PropTypes.object.isRequired,
    searchKeyword: PropTypes.string.isRequired,
    treeIndex: PropTypes.number.isRequired,
    trees: PropTypes.arrayOf(PropTypes.object).isRequired
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    cutTarget,
    dragTarget,
    keyboardTarget,
    menuTarget
  } = state
  const {itemInfo} = ownProps

  const isCutTarget = Boolean(cutTarget && cutTarget.id === itemInfo.id)
  const isDragTarget = Boolean(dragTarget && dragTarget.id === itemInfo.id)
  const isKeyboardTarget = Boolean(keyboardTarget && keyboardTarget.id === itemInfo.id)
  const isMenuTarget = Boolean(menuTarget && menuTarget.id === itemInfo.id)

  return {
    dragIndicator: state.dragIndicator,
    dragTarget: dragTarget,
    isGreyItem: isCutTarget || isDragTarget,
    isKeepInView: isKeyboardTarget || isMenuTarget,
    isSelected: isDragTarget || isKeyboardTarget || isMenuTarget,
    itemOffsetHeight: state.itemOffsetHeight,
    options: state.options,
    searchKeyword: state.searchKeyword,
    trees: state.trees
  }
}

export default connect(mapStateToProps)(BookmarkItem)
