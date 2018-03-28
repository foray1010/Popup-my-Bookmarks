// @flow
// @jsx createElement

import '../../../../css/popup/bookmark-tree.css'

import {PureComponent, createElement} from 'react'
import List from 'react-virtualized/dist/es/List'

import * as CST from '../../constants'
import type {BookmarkInfo, BookmarkTree as BookmarkTreeType} from '../../types'
import Mask from '../Mask'
import BookmarkRow from './BookmarkRow'
import TreeHeader from './TreeHeader'

type Props = {|
  focusId: string,
  iconSize: number,
  isShowCover: boolean,
  isShowHeader: boolean,
  listItemWidth: number,
  onCloseButtonClick: () => void,
  onCoverClick: () => void,
  onRowAuxClick: (string) => (MouseEvent) => void,
  onRowClick: (string) => (SyntheticMouseEvent<HTMLElement>) => void,
  onRowMouseEnter: (BookmarkInfo) => () => void,
  onRowMouseLeave: () => void,
  rowHeight: number,
  scrollToIndex: number,
  treeInfo: BookmarkTreeType
|}
type State = {|
  listHeight: number
|}
class BookmarkTree extends PureComponent<Props, State> {
  state = {
    listHeight: 0
  }

  componentDidMount() {
    this.setHeight()
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.treeInfo !== this.props.treeInfo) {
      // force recalculate all row heights as it doesn't recalculate
      this.props.treeInfo.children.forEach((x, index) => {
        if (this.list) this.list.recomputeRowHeights(index)
      })

      this.setHeight()
    }
  }

  getRowHeight = (payload: {| index: number |}) => {
    let rowHeight = this.props.rowHeight

    const bookmarkInfo = this.props.treeInfo.children[payload.index]
    if (bookmarkInfo.type === CST.TYPE_SEPARATOR) {
      rowHeight /= 2
    }

    // for the indicator show the end of folder
    if (payload.index === this.props.treeInfo.children.length - 1) {
      rowHeight += CST.GOLDEN_GAP * 2
    }

    return rowHeight
  }

  setHeight = () => {
    const grid = this.list ? this.list.Grid : null

    // search-box and tree-header-box height
    const listContainerElOffsetTop = grid ?
      grid._scrollingContainer.getBoundingClientRect().top :
      0

    const totalRowHeight = grid ? grid._rowSizeAndPositionManager.getTotalSize() : 0

    const maxListHeight = CST.MAX_HEIGHT - listContainerElOffsetTop

    this.setState({
      listHeight: Math.min(maxListHeight, totalRowHeight)
    })
  }

  list: ?Object
  render = () => (
    <section styleName='main'>
      {this.props.isShowHeader && (
        <TreeHeader
          title={this.props.treeInfo.parent.title}
          onClose={this.props.onCloseButtonClick}
        />
      )}

      <List
        ref={(ref) => {
          this.list = ref
        }}
        height={this.state.listHeight}
        // onScroll={this.props.onScroll}
        rowCount={this.props.treeInfo.children.length}
        rowHeight={this.getRowHeight}
        rowRenderer={(rendererProps: {| index: number, key: string, style: Object |}) => {
          const bookmarkInfo = this.props.treeInfo.children[rendererProps.index]
          return (
            <div key={rendererProps.key} styleName='list-item' style={rendererProps.style}>
              <BookmarkRow
                key={bookmarkInfo.id}
                bookmarkInfo={bookmarkInfo}
                iconSize={this.props.iconSize}
                isFocused={this.props.focusId === bookmarkInfo.id}
                onAuxClick={this.props.onRowAuxClick}
                onClick={this.props.onRowClick}
                onMouseEnter={this.props.onRowMouseEnter}
                onMouseLeave={this.props.onRowMouseLeave}
              />
            </div>
          )
        }}
        scrollToIndex={this.props.scrollToIndex >= 0 ? this.props.scrollToIndex : undefined}
        // scrollTop={this.props.lastScrollTop}
        tabIndex={-1}
        width={this.props.listItemWidth}
      />

      {this.props.isShowCover && (
        <Mask backgroundColor='#000' opacity={0.16} onClick={this.props.onCoverClick} />
      )}
    </section>
  )
}

export default BookmarkTree
