import {autobind, debounce, decorate} from 'core-decorators'
import {createElement, PropTypes, PureComponent} from 'react'
import _debounce from 'lodash/debounce'
import classNames from 'classnames'

import {
  getBookmark,
  getBookmarkType,
  getClickType,
  openBookmark,
  openMultipleBookmarks
} from '../../../functions'
import {
  ROOT_ID,
  TYPE_BOOKMARK,
  TYPE_FOLDER,
  TYPE_ROOT_FOLDER,
  TYPE_SEPARATOR
} from '../../../constants'

import '../../../../../css/popup/bookmark-item.css'
import folderIcon from '../../../../../img/folder.png'

class BookmarkItem extends PureComponent {
  componentDidMount() {
    this.setAuxClickEvent()
    this.setTooltip()
  }

  componentDidUpdate() {
    this.setTooltip()
  }

  componentWillUnmount() {
    const {
      closeEditor,
      closeMenu,
      isEditorTarget,
      isMenuTarget,
      itemInfo,
      removeFocusTargetById
    } = this.props

    if (isEditorTarget) {
      closeEditor()
    }

    removeFocusTargetById(itemInfo.id)

    if (isMenuTarget) {
      closeMenu()
    }
  }

  async getTooltip() {
    const {
      isSearching,
      itemInfo,
      options
    } = this.props

    const tooltipArr = []

    if (options.tooltip) {
      tooltipArr.push(itemInfo.title, itemInfo.url)
    }

    if (isSearching) {
      const breadcrumbArr = []

      let breadId = itemInfo.parentId
      while (breadId !== ROOT_ID) {
        const thisItemInfo = await getBookmark(breadId)

        breadcrumbArr.unshift(thisItemInfo.title)
        breadId = thisItemInfo.parentId
      }

      tooltipArr.unshift(
        `[${breadcrumbArr.join(' > ')}]`
      )
    }

    return tooltipArr.join('\n')
  }

  setAuxClickEvent() {
    // temp fix for https://github.com/facebook/react/issues/8529
    this.baseEl.addEventListener('auxclick', this.handleClick)
  }

  async setTooltip() {
    const {itemInfo} = this.props

    const bookmarkType = getBookmarkType(itemInfo)

    if (bookmarkType === TYPE_BOOKMARK) {
      const tooltip = await this.getTooltip()

      if (this.baseEl && tooltip) {
        this.baseEl.title = tooltip
      }
    }
  }

  @autobind
  async handleClick(evt) {
    // only allow left and middle click
    if (![0, 1].includes(evt.button)) return

    evt.preventDefault()

    const {
      itemInfo,
      leftClickBookmarkItem,
      options,
      treeIndex
    } = this.props

    const bookmarkType = getBookmarkType(itemInfo)

    switch (bookmarkType) {
      case TYPE_ROOT_FOLDER:
      case TYPE_FOLDER:
        if (evt.button === 0) {
          leftClickBookmarkItem(itemInfo, treeIndex + 1)
        } else {
          await openMultipleBookmarks(itemInfo, {
            isNewWindow: false,
            isWarnWhenOpenMany: options.warnOpenMany
          })
        }
        break

      case TYPE_SEPARATOR:
      case TYPE_BOOKMARK: {
        const clickType = getClickType(evt)
        await openBookmark(itemInfo, clickType, options)
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
      itemInfo,
      openMenu
    } = this.props

    openMenu(itemInfo, {
      x: evt.clientX,
      y: evt.clientY
    })
  }

  @autobind
  handleDragEnter(evt) {
    evt.persist()

    this._handleDragEnter(evt)
  }

  @debounce(50)
  _handleDragEnter(evt) {
    const {
      dragOver,
      itemInfo,
      treeIndex
    } = this.props

    const targetOffset = evt.target.getBoundingClientRect()

    const isPlaceAfter = evt.clientY - targetOffset.top > targetOffset.height / 2

    dragOver(itemInfo, treeIndex, isPlaceAfter)
  }

  @autobind
  handleDragStart() {
    const {
      dragStart,
      itemInfo,
      treeIndex
    } = this.props

    dragStart(itemInfo, treeIndex)
  }

  @autobind
  handleMouse(evt) {
    const {
      itemInfo,
      removeFocusTargetById,
      updateFocusTarget
    } = this.props

    switch (evt.type) {
      case 'mouseenter':
        updateFocusTarget(itemInfo)

        this._handleMouseEnter()
        break

      case 'mouseleave':
        removeFocusTargetById(itemInfo.id)

        this._handleMouseEnter.cancel()
        break

      default:
    }
  }

  @decorate(_debounce, 200)
  _handleMouseEnter() {
    const {
      hoverBookmarkItem,
      itemInfo,
      treeIndex
    } = this.props

    hoverBookmarkItem(itemInfo, treeIndex + 1)
  }

  render() {
    const {
      isSearching,
      isSelected,
      isUnclickable,
      itemInfo
    } = this.props

    const bookmarkType = getBookmarkType(itemInfo)
    const itemTitle = itemInfo.title || itemInfo.url || null
    const thisStyleName = classNames(
      'main',
      {
        'root-folder': bookmarkType === TYPE_ROOT_FOLDER,
        selected: isSelected,
        separator: bookmarkType === TYPE_SEPARATOR,
        unclickable: isUnclickable
      }
    )

    let iconSrc = null
    switch (bookmarkType) {
      case TYPE_ROOT_FOLDER:
      case TYPE_FOLDER:
        iconSrc = folderIcon
        break

      case TYPE_BOOKMARK:
        iconSrc = `chrome://favicon/${itemInfo.url}`
        break

      default:
    }

    let isDraggable = false
    switch (bookmarkType) {
      case TYPE_FOLDER:
      case TYPE_BOOKMARK:
        if (!isSearching) {
          isDraggable = true
        }
        break

      default:
    }

    return (
      <div
        ref={(ref) => {
          this.baseEl = ref
        }}
        styleName={thisStyleName}
        id={itemInfo.id}
        draggable={isDraggable}
        onClick={this.handleClick}
        onContextMenu={this.handleContextMenu}
        onDragEnter={this.handleDragEnter}
        onDragStart={this.handleDragStart}
        onMouseEnter={this.handleMouse}
        onMouseLeave={this.handleMouse}
      >
        <img
          styleName='icon'
          src={iconSrc}
          alt=''
          hidden={iconSrc === null}
        />
        <span styleName='title'>{itemTitle}</span>
      </div>
    )
  }
}

BookmarkItem.propTypes = {
  closeEditor: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
  dragOver: PropTypes.func.isRequired,
  dragStart: PropTypes.func.isRequired,
  hoverBookmarkItem: PropTypes.func.isRequired,
  isEditorTarget: PropTypes.bool.isRequired,
  isMenuTarget: PropTypes.bool.isRequired,
  isSearching: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isUnclickable: PropTypes.bool.isRequired,
  itemInfo: PropTypes.object.isRequired,
  leftClickBookmarkItem: PropTypes.func.isRequired,
  openMenu: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  removeFocusTargetById: PropTypes.func.isRequired,
  treeIndex: PropTypes.number.isRequired,
  updateFocusTarget: PropTypes.func.isRequired
}

export default BookmarkItem
