import '../../../../css/popup/bookmark-tree.css'

import PropTypes from 'prop-types'
import {PureComponent, createElement} from 'react'
import List from 'react-virtualized/dist/commonjs/List'

import {GOLDEN_GAP, MAX_HEIGHT, TYPE_SEPARATOR} from '../../constants'
import {getBookmarkType} from '../../functions'
import FolderCover from '../FolderCover'
import TreeHeader from './TreeHeader'

class BookmarkTree extends PureComponent {
  static defaultProps = {
    lastScrollTop: 0
  }

  static propTypes = {
    itemOffsetHeight: PropTypes.number.isRequired,
    lastScrollTop: PropTypes.number.isRequired,
    listItemWidth: PropTypes.number.isRequired,
    onScroll: PropTypes.func.isRequired,
    scrollToIndex: PropTypes.number.isRequired,
    treeIndex: PropTypes.number.isRequired,
    treeItems: PropTypes.arrayOf(PropTypes.node).isRequired
  }

  state = {
    listHeight: 0
  }

  componentDidMount() {
    this.setHeight()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.treeItems !== this.props.treeItems) {
      // `treeItems` doesn't pass to react-virtualized as props, it never know it is updated
      this.list.forceUpdateGrid()

      // force recalculate all row heights as it doesn't recalculate
      this.props.treeItems.forEach((treeItem, index) => {
        this.list.recomputeRowHeights(index)
      })
      this.setHeight()
    }
  }

  getRowHeight = ({index}) => {
    let rowHeight = this.props.itemOffsetHeight

    const itemInfo = this.props.treeItems[index].props.itemInfo
    if (itemInfo) {
      const bookmarkType = getBookmarkType(itemInfo)
      if (bookmarkType === TYPE_SEPARATOR) {
        rowHeight /= 2
      }
    }

    // for the indicator show the end of folder
    if (index === this.props.treeItems.length - 1) {
      rowHeight += GOLDEN_GAP * 2
    }

    return rowHeight
  }

  setHeight() {
    // search-box and tree-header-box height
    const listContainerElOffsetTop = this.listContainerEl.getBoundingClientRect().top

    const maxListHeight = MAX_HEIGHT - listContainerElOffsetTop
    const totalRowHeight = this.list.Grid._rowSizeAndPositionManager.getTotalSize()

    this.setState({
      listHeight: Math.min(maxListHeight, totalRowHeight)
    })
  }

  rowRenderer = ({index, key, style}) => (
    <div key={key} styleName='list-item' style={style}>
      {this.props.treeItems[index]}
    </div>
  )

  render = () => (
    <section styleName='main'>
      <TreeHeader treeIndex={this.props.treeIndex} />
      <div
        ref={(ref) => {
          this.listContainerEl = ref
        }}
      >
        <List
          ref={(ref) => {
            this.list = ref
          }}
          height={this.state.listHeight}
          noRowsRenderer={this.noRowsRenderer}
          onScroll={this.props.onScroll}
          rowCount={this.props.treeItems.length}
          rowHeight={this.getRowHeight}
          rowRenderer={this.rowRenderer}
          scrollToIndex={this.props.scrollToIndex >= 0 ? this.props.scrollToIndex : undefined}
          scrollTop={this.props.lastScrollTop}
          tabIndex={-1}
          width={this.props.listItemWidth}
        />
      </div>
      <FolderCover treeIndex={this.props.treeIndex} />
    </section>
  )
}

export default BookmarkTree
