// @flow
// @jsx createElement

import '../../../../css/popup/bookmark-tree.css'

import {PureComponent, createElement} from 'react'
import List from 'react-virtualized/dist/es/List'

import * as CST from '../../constants'
import type {BookmarkInfo, BookmarkTree as BookmarkTreeType} from '../../types'
import BookmarkItem from './BookmarkItem'

type Props = {|
  focusId: string,
  iconSize: number,
  listItemWidth: number,
  onAuxClick: (string) => (MouseEvent) => void,
  onMouseEnter: (BookmarkInfo) => () => void,
  onMouseLeave: () => void,
  rowHeight: number,
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
        if (this.listEl) this.listEl.recomputeRowHeights(index)
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
    // search-box and tree-header-box height
    const listContainerElOffsetTop = this.listContainerEl ?
      this.listContainerEl.getBoundingClientRect().top :
      0

    const totalRowHeight = this.listEl ?
      this.listEl.Grid._rowSizeAndPositionManager.getTotalSize() :
      0

    const maxListHeight = CST.MAX_HEIGHT - listContainerElOffsetTop

    this.setState({
      listHeight: Math.min(maxListHeight, totalRowHeight)
    })
  }

  listContainerEl: ?HTMLElement
  listEl: ?Object
  render = () => (
    <section styleName='main'>
      <div
        ref={(ref) => {
          this.listContainerEl = ref
        }}
      >
        <List
          ref={(ref) => {
            this.listEl = ref
          }}
          height={this.state.listHeight}
          // onScroll={this.props.onScroll}
          rowCount={this.props.treeInfo.children.length}
          rowHeight={this.getRowHeight}
          rowRenderer={(rendererProps: {| index: number, key: string, style: Object |}) => {
            const bookmarkInfo = this.props.treeInfo.children[rendererProps.index]
            return (
              <div key={rendererProps.key} styleName='list-item' style={rendererProps.style}>
                <BookmarkItem
                  key={bookmarkInfo.id}
                  bookmarkInfo={bookmarkInfo}
                  iconSize={this.props.iconSize}
                  isFocused={this.props.focusId === bookmarkInfo.id}
                  onAuxClick={this.props.onAuxClick}
                  onMouseEnter={this.props.onMouseEnter}
                  onMouseLeave={this.props.onMouseLeave}
                />
              </div>
            )
          }}
          // scrollToIndex={this.props.scrollToIndex >= 0 ? this.props.scrollToIndex : undefined}
          // scrollTop={this.props.lastScrollTop}
          tabIndex={-1}
          width={this.props.listItemWidth}
        />
      </div>
    </section>
  )
}

export default BookmarkTree
