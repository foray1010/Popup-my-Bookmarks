// @flow strict

import * as R from 'ramda'
import * as React from 'react'
import List from 'react-virtualized/dist/es/List'

import classes from '../../../../css/popup/bookmark-tree.css'
import * as CST from '../../constants'
import type {BookmarkInfo, BookmarkTree as BookmarkTreeType} from '../../types'
import {type ResponseEvent} from '../dragAndDrop/DragAndDropConsumer'
import Mask from '../Mask'
import BookmarkRow from './BookmarkRow'
import TreeHeader from './TreeHeader'

type Props = {|
  highlightedId: string,
  iconSize: number,
  isDisableDragAndDrop: boolean,
  isShowCover: boolean,
  isShowHeader: boolean,
  listItemWidth: number,
  noRowsRenderer: () => React.Node,
  onCloseButtonClick: () => void,
  onCoverClick: () => void,
  onRowAuxClick: (string) => (MouseEvent) => void,
  onRowClick: (string) => (SyntheticMouseEvent<HTMLElement>) => void,
  onRowDragOver: (BookmarkInfo) => (SyntheticMouseEvent<HTMLElement>, ResponseEvent) => void,
  onRowDragStart: () => void,
  onRowMouseEnter: (BookmarkInfo) => () => void,
  onRowMouseLeave: () => void,
  rowHeight: number,
  scrollToIndex: number,
  treeInfo: BookmarkTreeType
|}
type State = {|
  listHeight: number
|}
class BookmarkTree extends React.PureComponent<Props, State> {
  list: ?Object

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
    if (!this.list) return

    const maxListHeight =
      CST.MAX_HEIGHT - this.list.Grid._scrollingContainer.getBoundingClientRect().top
    const minListHeight = this.props.rowHeight

    const totalRowHeight = this.props.treeInfo.children.reduce(
      (acc, x, index) => acc + this.getRowHeight({index}),
      0
    )

    this.setState({
      listHeight: R.clamp(minListHeight, maxListHeight, totalRowHeight)
    })
  }

  render = () => (
    <section className={classes.main}>
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
        noRowsRenderer={this.props.noRowsRenderer}
        // onScroll={this.props.onScroll}
        rowCount={this.props.treeInfo.children.length}
        rowHeight={this.getRowHeight}
        rowRenderer={(rendererProps: {| index: number, style: Object |}) => {
          const bookmarkInfo = this.props.treeInfo.children[rendererProps.index]
          return (
            <div key={bookmarkInfo.id} className={classes['list-item']} style={rendererProps.style}>
              <BookmarkRow
                bookmarkInfo={bookmarkInfo}
                iconSize={this.props.iconSize}
                isDisableDragAndDrop={this.props.isDisableDragAndDrop}
                isHighlighted={this.props.highlightedId === bookmarkInfo.id}
                onAuxClick={this.props.onRowAuxClick}
                onClick={this.props.onRowClick}
                onDragOver={this.props.onRowDragOver}
                onDragStart={this.props.onRowDragStart}
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
