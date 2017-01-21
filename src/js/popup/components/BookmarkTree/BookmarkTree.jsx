import {autobind} from 'core-decorators'
import {createElement, PropTypes, PureComponent} from 'react'
import {static as Immutable} from 'seamless-immutable'
import CSSModules from 'react-css-modules'

import {
  DRAG_INDICATOR,
  MAX_HEIGHT
} from '../../constants'
import {
  genBookmarkList,
  lastScrollTopListStorage,
  updateLastScrollTopList
} from '../../functions'
import {
  requestAnimationFrame
} from '../../../common/lib/decoraters'
import BookmarkItem from './BookmarkItem'
import DragIndicator from './DragIndicator'
import FolderCover from '../FolderCover'
import NoResult from './NoResult'
import TreeHeader from './TreeHeader'

import styles from '../../../../css/popup/bookmark-tree.css'

class BookmarkTree extends PureComponent {
  componentDidMount() {
    this.setHeight()
    this.setScrollTop()
  }

  componentDidUpdate() {
    this.setHeight()
  }

  getTreeItems() {
    const {
      dragIndicator,
      isSearching,
      rootTree,
      treeIndex,
      treeInfo
    } = this.props

    const bookmarkList = genBookmarkList(treeInfo, {isSearching, rootTree, treeIndex})

    const treeItems = bookmarkList.map((itemInfo) => (
      <BookmarkItem
        key={itemInfo.id}
        itemInfo={itemInfo}
        treeIndex={treeIndex}
      />
    ))

    if (dragIndicator && dragIndicator.parentId === treeInfo.id) {
      let dragIndicatorIndex = dragIndicator.index

      const isFirstTree = treeIndex === 0
      if (isFirstTree && !isSearching) {
        dragIndicatorIndex += rootTree.children.length
      }

      return Immutable([
        ...treeItems.slice(0, dragIndicatorIndex),
        <DragIndicator key={DRAG_INDICATOR} />,
        ...treeItems.slice(dragIndicatorIndex)
      ])
    }

    return treeItems
  }

  @requestAnimationFrame
  setHeight() {
    if (this.bookmarkListEl) {
      // search-box and tree-header-box height
      const bookmarkListElOffsetTop = this.bookmarkListEl.getBoundingClientRect().top

      const maxListHeight = MAX_HEIGHT - bookmarkListElOffsetTop

      const listHeight = Math.min(this.bookmarkListEl.scrollHeight, maxListHeight)

      this.bookmarkListEl.style.maxHeight = listHeight + 'px'
    }
  }

  @requestAnimationFrame
  setScrollTop() {
    const {
      isRememberLastPosition,
      treeIndex
    } = this.props

    if (isRememberLastPosition) {
      const lastScrollTopList = lastScrollTopListStorage.get()

      const lastScrollTop = lastScrollTopList[treeIndex]
      if (lastScrollTop) {
        this.bookmarkListEl.scrollTop = lastScrollTop
      }
    }
  }

  @autobind
  handleScroll() {
    const {
      isRememberLastPosition
    } = this.props

    if (isRememberLastPosition) {
      updateLastScrollTopList()
    }
  }

  @autobind
  handleWheel(evt) {
    evt.preventDefault()

    const {itemOffsetHeight} = this.props

    // control scrolling speed
    this.bookmarkListEl.scrollTop += Math.floor(itemOffsetHeight * evt.deltaY / 40)
  }

  render() {
    const {
      isSearching,
      treeIndex
    } = this.props

    const treeItems = this.getTreeItems()

    return (
      <section styleName='main'>
        <TreeHeader treeIndex={treeIndex} />
        <ul
          ref={(ref) => {
            this.bookmarkListEl = ref
          }}
          styleName='list'
          onKeyDown={this.handleKeyDown}
          onScroll={this.handleScroll}
          onWheel={this.handleWheel}
        >
          {treeItems}
          {isSearching && treeItems.length === 0 ? <NoResult /> : null}
        </ul>
        <FolderCover treeIndex={treeIndex} />
      </section>
    )
  }
}

BookmarkTree.propTypes = {
  dragIndicator: PropTypes.object,
  isRememberLastPosition: PropTypes.bool.isRequired,
  isSearching: PropTypes.bool.isRequired,
  itemOffsetHeight: PropTypes.number.isRequired,
  rootTree: PropTypes.object.isRequired,
  treeIndex: PropTypes.number.isRequired,
  treeInfo: PropTypes.object.isRequired
}

export default CSSModules(BookmarkTree, styles)
