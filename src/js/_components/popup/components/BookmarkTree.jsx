import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'

import {
  genBookmarkList
} from '../functions'
import {
  MAX_HEIGHT
} from '../constants'
import BookmarkItem from './BookmarkItem'
import DragIndicator from './DragIndicator'
import FolderCover from './FolderCover'
import NoResult from './NoResult'
import TreeHeader from './TreeHeader'

const mapStateToProps = (state) => ({
  dragIndicator: state.dragIndicator,
  itemOffsetHeight: state.itemOffsetHeight,
  rootTree: state.rootTree,
  searchKeyword: state.searchKeyword,
  trees: state.trees
})

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
    const bookmarkListEl = this.bookmarkList

    // search-box and tree-header-box height
    const bookmarkListElOffsetTop = bookmarkListEl.getBoundingClientRect().top

    const maxListHeight = MAX_HEIGHT - bookmarkListElOffsetTop

    const listHeight = Math.min(bookmarkListEl.scrollHeight, maxListHeight)

    bookmarkListEl.style.maxHeight = listHeight + 'px'
  }

  afterRender() {
    window.requestAnimationFrame(this.setHeight)
  }

  @autobind
  handleScroll() {
  }

  @autobind
  handleWheel(evt) {
    evt.preventDefault()

    const {itemOffsetHeight} = this.props

    // control scrolling speed
    this.bookmarkList.scrollTop -= Math.floor(itemOffsetHeight * evt.deltaY / 120)
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

      treeItems.splice(dragIndicator.index, 0, <DragIndicator />)
    }

    if (searchKeyword && treeItems.length === 0) {
      treeItems.push(
        <NoResult key='no-result' />
      )
    }

    return (
      <div className='bookmark-tree'>
        <TreeHeader treeIndex={treeIndex} />
        <ul
          ref={(ref) => {
            this.bookmarkList = ref
          }}
          className='bookmark-list'
          onScroll={this.handleScroll}
          onWheel={this.handleWheel}
        >
          {treeItems}
        </ul>
        <FolderCover treeIndex={treeIndex} />
      </div>
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

export default connect(mapStateToProps)(BookmarkTree)
