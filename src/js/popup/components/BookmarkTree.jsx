import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, PropTypes, PureComponent} from 'react'
import {static as Immutable} from 'seamless-immutable'
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
      treeIndex
    } = this.props

    if (this.isRememberLastPosition()) {
      const lastScrollTopList = lastScrollTopListStorage.get()

      const lastScrollTop = lastScrollTopList[treeIndex]
      if (lastScrollTop) {
        this.bookmarkListEl.scrollTop = lastScrollTop
      }
    }
  }

  @autobind
  handleScroll() {
    if (this.isRememberLastPosition()) {
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

  isRememberLastPosition() {
    const {
      isSearching,
      options
    } = this.props

    return options.rememberPos && !isSearching
  }

  render() {
    const {
      dragIndicator,
      isSearching,
      rootTree,
      treeIndex,
      trees
    } = this.props

    const isFirstTree = treeIndex === 0
    const treeInfo = trees[treeIndex]

    const bookmarkList = genBookmarkList(treeInfo, {isSearching, rootTree, treeIndex})

    const treeItems = Immutable.asMutable(bookmarkList).map((itemInfo) => (
      <BookmarkItem
        key={itemInfo.id}
        itemInfo={itemInfo}
        treeIndex={treeIndex}
      />
    ))

    if (dragIndicator && dragIndicator.parentId === treeInfo.id) {
      let dragIndicatorIndex = dragIndicator.index

      if (isFirstTree && !isSearching) {
        dragIndicatorIndex += rootTree.children.length
      }

      treeItems.splice(dragIndicatorIndex, 0, <DragIndicator key={DRAG_INDICATOR} />)
    }

    if (isSearching && treeItems.length === 0) {
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
  isSearching: PropTypes.bool.isRequired,
  itemOffsetHeight: PropTypes.number.isRequired,
  options: PropTypes.object.isRequired,
  rootTree: PropTypes.object.isRequired,
  treeIndex: PropTypes.number.isRequired,
  trees: PropTypes.arrayOf(PropTypes.object).isRequired
}

const mapStateToProps = (state) => ({
  dragIndicator: state.dragIndicator,
  isSearching: Boolean(state.searchKeyword),
  itemOffsetHeight: state.itemOffsetHeight,
  options: state.options,
  rootTree: state.rootTree,
  trees: state.trees
})

export default connect(mapStateToProps)(
  CSSModules(BookmarkTree, styles)
)
