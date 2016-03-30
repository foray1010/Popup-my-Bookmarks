import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'

import {
  DRAG_INDICATOR,
  MAX_HEIGHT
} from '../constants'
import {
  genBookmarkList
} from '../functions'
import BookmarkItem from './BookmarkItem'
import DragIndicator from './DragIndicator'
import FolderCover from './FolderCover'
import NoResult from './NoResult'
import TreeHeader from './TreeHeader'

class BookmarkTree extends Component {
  constructor() {
    super()

    this.genBookmarkList = genBookmarkList.bind(this)
  }

  componentDidMount() {
    this.afterRender()
  }

  componentDidUpdate() {
    this.afterRender()
  }

  @autobind
  setHeight() {
    const {bookmarkListEl} = this

    if (bookmarkListEl) {
      // search-box and tree-header-box height
      const bookmarkListElOffsetTop = bookmarkListEl.getBoundingClientRect().top

      const maxListHeight = MAX_HEIGHT - bookmarkListElOffsetTop

      const listHeight = Math.min(bookmarkListEl.scrollHeight, maxListHeight)

      bookmarkListEl.style.maxHeight = listHeight + 'px'
    }
  }

  afterRender() {
    window.requestAnimationFrame(this.setHeight)
  }

  @autobind
  handleKeyDown(evt) {
    switch (evt.keyCode) {
      case 37: // left
      case 38: // up
      case 39: // right
      case 40: // down
        evt.preventDefault()
        break

      default:
    }
  }

  @autobind
  handleScroll() {
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

    const bookmarkList = this.genBookmarkList(treeInfo, treeIndex)

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

      treeItems.splice(dragIndicator.index, 0, <DragIndicator key={DRAG_INDICATOR} />)
    }

    if (searchKeyword && treeItems.length === 0) {
      treeItems.push(
        <NoResult key='no-result' />
      )
    }

    return (
      <section className='bookmark-tree'>
        <TreeHeader treeIndex={treeIndex} />
        <ul
          ref={(ref) => {
            this.bookmarkListEl = ref
          }}
          className='bookmark-list'
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

if (process.env.NODE_ENV !== 'production') {
  BookmarkTree.propTypes = {
    dragIndicator: PropTypes.object,
    itemOffsetHeight: PropTypes.number.isRequired,
    rootTree: PropTypes.object.isRequired,
    searchKeyword: PropTypes.string.isRequired,
    treeIndex: PropTypes.number.isRequired,
    trees: PropTypes.arrayOf(PropTypes.object).isRequired
  }
}

const mapStateToProps = (state) => ({
  dragIndicator: state.dragIndicator,
  itemOffsetHeight: state.itemOffsetHeight,
  rootTree: state.rootTree,
  searchKeyword: state.searchKeyword,
  trees: state.trees
})

export default connect(mapStateToProps)(BookmarkTree)
