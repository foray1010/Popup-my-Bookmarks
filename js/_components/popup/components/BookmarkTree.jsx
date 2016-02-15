import {bind} from 'decko'
import {connect} from 'react-redux'
import {Component, h} from 'preact'

import {
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

function setHeight(el) {
  const bookmarkListEl = el.getElementsByClassName('bookmark-list')[0]

  // search-box and tree-header-box height
  const bookmarkListElOffsetTop = bookmarkListEl.getBoundingClientRect().top

  const maxListHeight = MAX_HEIGHT - bookmarkListElOffsetTop

  const listHeight = Math.min(bookmarkListEl.scrollHeight, maxListHeight)

  bookmarkListEl.style.maxHeight = listHeight + 'px'
}

const mapStateToProps = (state) => ({
  dragIndicator: state.dragIndicator,
  itemOffsetHeight: state.itemOffsetHeight,
  rootTree: state.rootTree,
  searchKeyword: state.searchKeyword,
  trees: state.trees
})

@connect(mapStateToProps)
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

  afterRender() {
    window.requestAnimationFrame(() => {
      const el = this.base

      if (el) {
        setHeight(el)
      }
    })
  }

  scrollHandler() {
  }

  @bind
  wheelHandler(evt) {
    evt.preventDefault()

    const {itemOffsetHeight} = this.props

    // control scrolling speed
    // this.scrollTop -= Math.floor(itemOffsetHeight * evt.wheelDelta / 120)
  }

  render(props) {
    const {
      dragIndicator,
      rootTree,
      searchKeyword,
      treeIndex,
      trees
    } = props

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
          className='bookmark-list'
          onScroll={this.scrollHandler}
          onWheel={this.wheelHandler}
        >
          {treeItems}
        </ul>
        <FolderCover treeIndex={treeIndex} />
      </div>
    )
  }
}

export default BookmarkTree
