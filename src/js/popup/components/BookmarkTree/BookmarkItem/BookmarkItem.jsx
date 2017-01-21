import {autobind, debounce, decorate} from 'core-decorators'
import {createElement, PropTypes, PureComponent} from 'react'
import _debounce from 'lodash/debounce'
import classNames from 'classnames'
import CSSModules from 'react-css-modules'

import {
  getBookmark,
  getBookmarkType,
  getClickType,
  openBookmark,
  openMultipleBookmarks,
  scrollIntoViewIfNeeded
} from '../../../functions'
import {
  requestAnimationFrame
} from '../../../../common/lib/decoraters'
import {
  ROOT_ID,
  TYPE_BOOKMARK,
  TYPE_FOLDER,
  TYPE_ROOT_FOLDER,
  TYPE_SEPARATOR
} from '../../../constants'
import chromep from '../../../../common/lib/chromePromise'

import styles from '../../../../../css/popup/bookmark-item.css'

class BookmarkItem extends PureComponent {
  componentDidMount() {
    this.afterMount()
    this.afterRender()
  }

  componentDidUpdate() {
    const {
      shouldKeepInView
    } = this.props

    this.afterRender()

    if (shouldKeepInView) {
      scrollIntoViewIfNeeded(this.baseEl)
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

  @requestAnimationFrame
  afterMount() {
    // temp fix for https://github.com/facebook/react/issues/8529
    this.baseEl.addEventListener('auxclick', this.handleClick)
  }

  @requestAnimationFrame
  async afterRender() {
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
  async handleDragEnd() {
    const {
      dragEnd,
      dragIndicator,
      dragTarget
    } = this.props

    if (dragIndicator) {
      await chromep.bookmarks.move(dragTarget.id, {
        parentId: dragIndicator.parentId,
        index: dragIndicator.index
      })
    }

    dragEnd()
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
      itemOffsetHeight,
      treeIndex
    } = this.props

    const isPlaceAfter = evt.offsetY > itemOffsetHeight / 2

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
      focusTarget,
      itemInfo,
      updateFocusTarget
    } = this.props

    switch (evt.type) {
      case 'mouseenter':
        if (focusTarget !== itemInfo) {
          updateFocusTarget(itemInfo)
        }

        this._handleMouseEnter()
        break

      case 'mouseleave':
        if (focusTarget === itemInfo) {
          updateFocusTarget(null)
        }

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
        iconSrc = '/img/folder.png'
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
      <li
        ref={(ref) => {
          this.baseEl = ref
        }}
        styleName={thisStyleName}
        id={itemInfo.id}
        draggable={isDraggable}
        onClick={this.handleClick}
        onContextMenu={this.handleContextMenu}
        onDragEnd={this.handleDragEnd}
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
      </li>
    )
  }
}

BookmarkItem.propTypes = {
  dragEnd: PropTypes.func.isRequired,
  dragIndicator: PropTypes.object,
  dragOver: PropTypes.func.isRequired,
  dragStart: PropTypes.func.isRequired,
  dragTarget: PropTypes.object,
  focusTarget: PropTypes.object,
  hoverBookmarkItem: PropTypes.func.isRequired,
  isSearching: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isUnclickable: PropTypes.bool.isRequired,
  itemInfo: PropTypes.object.isRequired,
  itemOffsetHeight: PropTypes.number.isRequired,
  leftClickBookmarkItem: PropTypes.func.isRequired,
  openMenu: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  shouldKeepInView: PropTypes.bool.isRequired,
  treeIndex: PropTypes.number.isRequired,
  updateFocusTarget: PropTypes.func.isRequired
}

export default CSSModules(BookmarkItem, styles, {allowMultiple: true})
