import {createElement, PureComponent} from 'react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import Immutable from 'seamless-immutable'
import List from 'react-virtualized/dist/commonjs/List'
import PropTypes from 'prop-types'
import R from 'ramda'
import store from 'store'

import {
  GOLDEN_GAP,
  MAX_HEIGHT,
  TYPE_SEPARATOR
} from '../../constants'
import {
  genBookmarkList,
  getBookmarkType,
  updateLastScrollTopList
} from '../../functions'
import BookmarkItem from './BookmarkItem'
import DragIndicator from './DragIndicator'
import FolderCover from '../FolderCover'
import NoResult from './NoResult'
import TreeHeader from './TreeHeader'

import '../../../../css/popup/bookmark-tree.css'

class BookmarkTree extends PureComponent {
  state = {
    listHeight: 0
  }

  componentDidMount() {
    this.setHeight()
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
        itemInfo={itemInfo}
        treeIndex={treeIndex}
      />
    ))

    if (isSearching && treeItems.length === 0) {
      return treeItems.concat(
        <NoResult />
      )
    }

    if (dragIndicator && dragIndicator.parentId === treeInfo.id) {
      let dragIndicatorIndex = dragIndicator.index

      const isFirstTree = treeIndex === 0
      if (isFirstTree && !isSearching) {
        dragIndicatorIndex += rootTree.children.length
      }

      return Immutable(
        R.insert(
          dragIndicatorIndex,
          <DragIndicator />,
          treeItems
        )
      )
    }
    return treeItems
  }

  setHeight() {
    // search-box and tree-header-box height
    const listContainerElOffsetTop = this.listContainerEl.getBoundingClientRect().top

    const maxListHeight = MAX_HEIGHT - listContainerElOffsetTop
    const totalRowHeight = this.list.Grid._rowSizeAndPositionManager.getTotalSize()

    const listHeight = Math.min(maxListHeight, totalRowHeight)

    if (this.state.listHeight !== listHeight) {
      this.setState({
        listHeight: listHeight
      })
    }
  }

  handleScroll = ({scrollTop}) => {
    const {
      isRememberLastPosition,
      treeIndex
    } = this.props

    if (isRememberLastPosition) {
      updateLastScrollTopList(treeIndex, scrollTop || 0)
    }
  }

  makeGetRowHeight(treeItems) {
    return ({
      index
    }) => {
      const {
        itemOffsetHeight
      } = this.props

      let rowHeight = itemOffsetHeight

      const itemInfo = treeItems[index].props.itemInfo
      if (itemInfo) {
        const bookmarkType = getBookmarkType(itemInfo)
        if (bookmarkType === TYPE_SEPARATOR) {
          rowHeight /= 2
        }
      }

      // for the indicator show the end of folder
      if (index === treeItems.length - 1) {
        rowHeight += GOLDEN_GAP * 2
      }

      return rowHeight
    }
  }

  makeRowRenderer(treeItems) {
    return ({
      index,
      key,
      style
    }) => (
      <div key={key} styleName='list-item' style={style}>
        {treeItems[index]}
      </div>
    )
  }

  render() {
    const {
      isRememberLastPosition,
      scrollToIndex,
      treeIndex
    } = this.props

    const treeItems = this.getTreeItems()

    const getRowHeight = this.makeGetRowHeight(treeItems)
    const rowRenderer = this.makeRowRenderer(treeItems)

    let lastScrollTop
    if (isRememberLastPosition) {
      const lastScrollTopList = store.get('lastScrollTop') || []

      lastScrollTop = lastScrollTopList[treeIndex]
    }

    return (
      <section styleName='main'>
        <TreeHeader treeIndex={treeIndex} />
        <div
          ref={(ref) => {
            this.listContainerEl = ref
          }}
        >
          <AutoSizer disableHeight>
            {({width}) => (
              <List
                ref={(ref) => {
                  this.list = ref
                }}
                height={this.state.listHeight}
                noRowsRenderer={this.noRowsRenderer}
                onScroll={this.handleScroll}
                rowCount={treeItems.length}
                rowHeight={getRowHeight}
                rowRenderer={rowRenderer}
                scrollToIndex={scrollToIndex >= 0 ? scrollToIndex : undefined}
                scrollTop={lastScrollTop}
                tabIndex={-1}
                width={width}
              />
            )}
          </AutoSizer>
        </div>
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
  scrollToIndex: PropTypes.number.isRequired,
  treeIndex: PropTypes.number.isRequired,
  treeInfo: PropTypes.object.isRequired
}

export default BookmarkTree
