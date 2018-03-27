// @flow
// @jsx createElement

import debounce from 'lodash.debounce'
import * as R from 'ramda'
import {PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

import * as CST from '../../constants'
import {bookmarkCreators, menuCreators} from '../../reduxs'
import type {BookmarkInfo, BookmarkTree as BookmarkTreeType, OpenIn} from '../../types'
import BookmarkTree from './BookmarkTree'

const TOGGLE_BOOKMARK_TREE_TIMEOUT = 200

type Props = {|
  focusId: string,
  focusedChildIndex: number,
  iconSize: number,
  isShowCover: boolean,
  isShowHeader: boolean,
  listItemWidth: number,
  openBookmarkTree: (string, string) => void,
  openBookmarksInBrowser: ($ReadOnlyArray<string>, OpenIn) => void,
  openMenu: (
    string,
    {|
      positionLeft: number,
      positionTop: number,
      targetLeft: number,
      targetTop: number
    |}
  ) => void,
  removeBookmarkTrees: (string) => void,
  removeFocusId: () => void,
  rowHeight: number,
  setFocusId: (string) => void,
  treeInfo: BookmarkTreeType
|}
class BookmarkTreeContainer extends PureComponent<Props> {
  closeCurrentTree = () => {
    this.props.removeBookmarkTrees(this.props.treeInfo.parent.id)
  }

  // to support `chrome < 55` as auxclick is not available
  _handleRowAllClick = (bookmarkId: string, evt) => {
    switch (evt.button) {
      case 0:
        this._handleRowLeftClick(bookmarkId)
        break
      case 1:
        this._handleRowMiddleClick(bookmarkId)
        break
      case 2:
        this._handleRowRightClick(bookmarkId, evt)
        break
      default:
    }
  }
  _handleRowLeftClick = (bookmarkId: string) => {
    this.props.openBookmarksInBrowser([bookmarkId], CST.OPEN_IN_TYPES.CURRENT_TAB)
  }
  _handleRowMiddleClick = (bookmarkId: string) => {
    this.props.openBookmarksInBrowser([bookmarkId], CST.OPEN_IN_TYPES.NEW_TAB)
  }
  _handleRowRightClick = (bookmarkId: string, evt) => {
    if (!(evt.currentTarget instanceof window.HTMLElement)) return

    const targetOffset = evt.currentTarget.getBoundingClientRect()
    this.props.openMenu(bookmarkId, {
      positionLeft: evt.clientX,
      positionTop: evt.clientY,
      targetLeft: targetOffset.left,
      targetTop: targetOffset.top
    })
  }
  handleRowAuxClick = (bookmarkId: string) => (evt: MouseEvent) => {
    this._handleRowAllClick(bookmarkId, evt)
  }
  handleRowClick = (bookmarkId: string) => (evt: SyntheticMouseEvent<HTMLElement>) => {
    this._handleRowAllClick(bookmarkId, evt)
  }

  handleRowMouseEnter = (bookmarkInfo: BookmarkInfo) => () => {
    this.toggleBookmarkTree(bookmarkInfo)
    this.props.setFocusId(bookmarkInfo.id)
  }

  handleRowMouseLeave = () => {
    this.toggleBookmarkTree.cancel()
    this.props.removeFocusId()
  }

  _toggleBookmarkTree = (bookmarkInfo: BookmarkInfo) => {
    if (bookmarkInfo.type === CST.TYPE_FOLDER) {
      this.props.openBookmarkTree(bookmarkInfo.id, this.props.treeInfo.parent.id)
    } else {
      this.closeCurrentTree()
    }
  }
  toggleBookmarkTree = debounce(this._toggleBookmarkTree, TOGGLE_BOOKMARK_TREE_TIMEOUT)

  render = () => (
    <BookmarkTree
      focusId={this.props.focusId}
      iconSize={this.props.iconSize}
      isShowCover={this.props.isShowCover}
      isShowHeader={this.props.isShowHeader}
      listItemWidth={this.props.listItemWidth}
      onClose={this.closeCurrentTree}
      onRowAuxClick={this.handleRowAuxClick}
      onRowClick={this.handleRowClick}
      onRowMouseEnter={this.handleRowMouseEnter}
      onRowMouseLeave={this.handleRowMouseLeave}
      rowHeight={this.props.rowHeight}
      scrollToIndex={this.props.focusedChildIndex}
      treeInfo={this.props.treeInfo}
    />
  )
}

const getIconSize = R.max(CST.MIN_BOOKMARK_ICON_SIZE)
const getRowHeight = (fontSize) =>
  getIconSize(fontSize) +
  // +1 for border width, GOLDEN_GAP for padding
  (1 + CST.GOLDEN_GAP) * 2

const mapStateToProps = (state, ownProps) => {
  const {focusId, trees} = state.bookmark
  const treeIndex = trees.findIndex(R.pathEq(['parent', 'id'], ownProps.treeId))
  const treeInfo = trees[treeIndex]
  return {
    focusId,
    focusedChildIndex: treeInfo.children.findIndex(R.propEq('id', focusId)),
    iconSize: getIconSize(state.options.fontSize),
    // cover the folder if it is not the top two folder
    isShowCover: trees.length - treeIndex > 2,
    isShowHeader: treeIndex !== 0,
    listItemWidth: state.options.setWidth,
    rowHeight: getRowHeight(state.options.fontSize),
    treeInfo
  }
}

const mapDispatchToProps = {
  ...R.pick(
    [
      'openBookmarkTree',
      'openBookmarksInBrowser',
      'removeBookmarkTrees',
      'removeFocusId',
      'setFocusId'
    ],
    bookmarkCreators
  ),
  ...R.pick(['openMenu'], menuCreators)
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkTreeContainer)
