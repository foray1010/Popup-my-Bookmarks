import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, PropTypes, PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import {
  DRAG_INDICATOR,
  MAX_HEIGHT
} from '../constants'
import {
  genBookmarkList,
  lastScrollTopListStorage,
  updateLastScrollTopList
} from '../functions'
import BookmarkItem from './BookmarkItem'
import DragIndicator from './DragIndicator'
import FolderCover from './FolderCover'
import NoResult from './NoResult'
import TreeHeader from './TreeHeader'

import styles from '../../../css/popup/bookmark-tree.css'

class BookmarkTree extends PureComponent {
  componentDidMount() {
    this.setHeight()
    this.setScrollTop()
  }

  componentDidUpdate() {
    this.setHeight()
  }

  setHeight() {
    window.requestAnimationFrame(this._setHeight)
  }

  setScrollTop() {
    window.requestAnimationFrame(this._setScrollTop)
  }

  @autobind
  _setHeight() {
    const {bookmarkListEl} = this

    if (bookmarkListEl) {
      // search-box and tree-header-box height
      const bookmarkListElOffsetTop = bookmarkListEl.getBoundingClientRect().top

      const maxListHeight = MAX_HEIGHT - bookmarkListElOffsetTop

      const listHeight = Math.min(bookmarkListEl.scrollHeight, maxListHeight)

      bookmarkListEl.style.maxHeight = listHeight + 'px'
    }
  }

  @autobind
  _setScrollTop() {
    const {
      options,
      treeIndex
    } = this.props

    if (options.rememberPos) {
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
      options
    } = this.props

    if (options.rememberPos) {
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
      dragIndicator,
      rootTree,
      searchKeyword,
      treeIndex,
      trees
    } = this.props

    const isFirstTree = treeIndex === 0
    const treeInfo = trees[treeIndex]

    const bookmarkList = genBookmarkList(treeInfo, {rootTree, searchKeyword, treeIndex})

    const treeItems = bookmarkList.asMutable().map((itemInfo) => (
      <BookmarkItem
        key={itemInfo.id}
        itemInfo={itemInfo}
        treeIndex={treeIndex}
      />
    ))

    if (dragIndicator && dragIndicator.parentId === treeInfo.id) {
      let dragIndicatorIndex = dragIndicator.index

      if (isFirstTree && !searchKeyword) {
        dragIndicatorIndex += rootTree.children.length
      }

      treeItems.splice(dragIndicatorIndex, 0, <DragIndicator key={DRAG_INDICATOR} />)
    }

    if (searchKeyword && treeItems.length === 0) {
      treeItems.push(
        <NoResult key='no-result' />
      )
    }

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
        </ul>
        <FolderCover treeIndex={treeIndex} />
      </section>
    )
  }
}

BookmarkTree.propTypes = {
  dragIndicator: PropTypes.object,
  itemOffsetHeight: PropTypes.number.isRequired,
  options: PropTypes.object.isRequired,
  rootTree: PropTypes.object.isRequired,
  searchKeyword: PropTypes.string.isRequired,
  treeIndex: PropTypes.number.isRequired,
  trees: PropTypes.arrayOf(PropTypes.object).isRequired
}

const mapStateToProps = (state) => ({
  dragIndicator: state.dragIndicator,
  itemOffsetHeight: state.itemOffsetHeight,
  options: state.options,
  rootTree: state.rootTree,
  searchKeyword: state.searchKeyword,
  trees: state.trees
})

export default connect(mapStateToProps)(
  CSSModules(BookmarkTree, styles)
)
