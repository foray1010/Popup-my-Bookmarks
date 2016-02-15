import {bind, debounce} from 'decko'
import {connect} from 'react-redux'
import {Component, h} from 'preact'

import {
  getBookmarkType,
  getFlatTree,
  isFolder,
  isFolderOpened,
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

const mapStateToProps = (state) => ({
  cutTarget: state.cutTarget,
  dragTarget: state.dragTarget,
  itemOffsetHeight: state.itemOffsetHeight,
  keyboardTarget: state.keyboardTarget,
  menuTarget: state.menuTarget,
  options: state.options,
  searchKeyword: state.searchKeyword,
  trees: state.trees
})

@connect(mapStateToProps)
class BookmarkItem extends Component {
  constructor() {
    super()

    this.openMultipleBookmarks = openMultipleBookmarks.bind(this)
  }

  componentDidMount() {
    this.afterRender()
  }

  componentDidUpdate() {
    this.afterRender()
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
        const el = document.getElementById(itemInfo.id)

        if (el) {
          const tooltip = await this.getTooltip()

          if (tooltip) {
            el.title = tooltip
          }
        }
      }
    })
  }

  @bind
  async clickHandler(evt) {
    evt.preventDefault()

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

  @bind
  contextMenuHandler(evt) {
    // disable native context menu
    evt.preventDefault()

    const {
      dispatch,
      itemInfo
    } = this.props

    dispatch([
      updateMousePosition({
        x: evt.x,
        y: evt.y
      }),
      updateMenuTarget(itemInfo)
    ])
  }

  @bind
  async dragEndHandler() {
    const {
      dispatch,
      dragIndicator,
      dragTarget
    } = this.props

    // because we move the original dragTargetEl to #drag-hack
    // the original dragTargetEl cannot be updated by preact, so the model will not be updated
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

  @bind
  @debounce(50)
  async dragEnterHandler(evt) {
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

  @bind
  dragStartHandler() {
    const {
      dispatch,
      itemInfo,
      treeIndex
    } = this.props

    // hack to prevent dragover and dragend event stop working when dragTargetEl is removed
    setTimeout(() => {
      const dragTargetEl = document.getElementById(itemInfo.id)

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

  @bind
  @debounce(200)
  async mouseHandler(evt) {
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

  render(props) {
    const {
      cutTarget,
      dragTarget,
      itemInfo,
      keyboardTarget,
      menuTarget,
      searchKeyword
    } = props

    const bookmarkType = getBookmarkType(itemInfo)
    const itemClasses = [
      'item',
      'bookmark-item'
    ]
    const itemTitle = itemInfo.title || itemInfo.url || null

    let iconSrc = null
    let isDraggable = true

    if (isFolder(itemInfo)) {
      iconSrc = '/img/folder.png'
    }

    switch (bookmarkType) {
      case TYPE_NO_BOOKMARK:
      case TYPE_ROOT_FOLDER:
        isDraggable = false
        itemClasses.push(bookmarkType)
        break

      case TYPE_SEPARATOR:
        itemClasses.push(bookmarkType)
        break

      case TYPE_BOOKMARK:
        iconSrc = `chrome://favicon/${itemInfo.url}`
        break

      default:
    }

    const isCutTarget = cutTarget && cutTarget.id === itemInfo.id
    const isDragTarget = dragTarget && dragTarget.id === itemInfo.id
    const isKeyboardTarget = keyboardTarget && keyboardTarget.id === itemInfo.id
    const isMenuTarget = menuTarget && menuTarget.id === itemInfo.id

    if (isCutTarget || isDragTarget) {
      itemClasses.push('grey-item')
    }

    if (isDragTarget || isKeyboardTarget || isMenuTarget) {
      itemClasses.push('selected')
    }

    if (searchKeyword) {
      isDraggable = false
    }

    return (
      <li
        id={itemInfo.id}
        draggable={String(isDraggable)}
        onDragEnd={this.dragEndHandler}
        onDragEnter={this.dragEnterHandler}
        onDragStart={this.dragStartHandler}
      >
        <a
          className={itemClasses.join(' ')}
          href={itemInfo.url || ''}
          draggable='false'
          onClick={this.clickHandler}
          onContextMenu={this.contextMenuHandler}
          onMouseEnter={this.mouseHandler}
          onMouseLeave={this.mouseHandler}
        >
          <img className='icon' src={iconSrc} alt='' draggable='false' />
          <span className='no-text-overflow'>{itemTitle}</span>
        </a>
      </li>
    )
  }
}

export default BookmarkItem
