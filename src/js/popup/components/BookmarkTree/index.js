// @flow strict

import debounce from 'lodash.debounce'
import * as R from 'ramda'
import * as React from 'react'
import {connect} from 'react-redux'

import * as CST from '../../constants'
import {type RootState, bookmarkCreators, menuCreators} from '../../reduxs'
import type {BookmarkInfo, BookmarkTree as BookmarkTreeType, OpenIn} from '../../types'
import {type ResponseEvent} from '../dragAndDrop/DragAndDropConsumer'
import DragAndDropContext, {type ContextType} from '../dragAndDrop/DragAndDropContext'
import BookmarkTree from './BookmarkTree'
import NoSearchResult from './NoSearchResult'

const TOGGLE_BOOKMARK_TREE_TIMEOUT = 200

type OwnProps = {|
  treeId: string
|}
type Props = {|
  ...OwnProps,
  highlightedId: string,
  highlightedIndex: number,
  iconSize: number,
  isSearching: boolean,
  isShowCover: boolean,
  isShowHeader: boolean,
  listItemWidth: number,
  openBookmarkTree: (string, string) => void,
  openBookmarksInBrowser: (Array<string>, OpenIn, boolean) => void,
  openMenu: (
    string,
    {|
      positionLeft: number,
      positionTop: number,
      targetLeft: number,
      targetTop: number
    |}
  ) => void,
  removeBookmarkTree: (string) => void,
  removeDragIndicator: () => void,
  removeFocusId: () => void,
  removeNextBookmarkTrees: (string) => void,
  rowHeight: number,
  setDragIndicator: (string, number) => void,
  setFocusId: (string) => void,
  treeInfo: BookmarkTreeType
|}
class BookmarkTreeContainer extends React.PureComponent<Props> {
  context: ContextType
  static contextType = DragAndDropContext

  closeCurrentTree = () => {
    this.props.removeBookmarkTree(this.props.treeInfo.parent.id)
  }
  closeNextTrees = () => {
    this.props.removeNextBookmarkTrees(this.props.treeInfo.parent.id)
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
    this.props.openBookmarksInBrowser([bookmarkId], CST.OPEN_IN_TYPES.CURRENT_TAB, true)
  }
  _handleRowMiddleClick = (bookmarkId: string) => {
    this.props.openBookmarksInBrowser([bookmarkId], CST.OPEN_IN_TYPES.NEW_TAB, true)
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
  handleRowDragOver = (bookmarkInfo: BookmarkInfo) => (
    evt: SyntheticMouseEvent<HTMLElement>,
    responseEvent: ResponseEvent
  ) => {
    if (bookmarkInfo.isRoot) {
      console.debug('skip as hovering root item')
      this.props.removeDragIndicator()
      return
    }
    if (bookmarkInfo.isSimulated) {
      console.debug('skip as hovering simulated item')
      return
    }

    const activeIndex = this.props.treeInfo.children.findIndex(
      (item) => item.id === responseEvent.activeKey
    )
    const index = this.props.treeInfo.children.findIndex(
      (item) => item.id === responseEvent.itemKey
    )

    const targetOffset = evt.currentTarget.getBoundingClientRect()
    const isOverBottomPart = evt.clientY - targetOffset.top > targetOffset.height / 2
    const targetIndex = index + (isOverBottomPart ? 1 : 0)

    const isNearActiveItem =
      activeIndex === -1 ? false : [activeIndex, activeIndex + 1].includes(targetIndex)
    if (isNearActiveItem) {
      console.debug('skip as nearby active item')
      this.props.removeDragIndicator()
      return
    }

    this.props.setDragIndicator(bookmarkInfo.parentId, targetIndex)
  }
  handleRowDragStart = () => {
    this.closeNextTrees()
  }
  handleRowMouseEnter = (bookmarkInfo: BookmarkInfo) => () => {
    this.toggleBookmarkTree(bookmarkInfo)
    this.props.setFocusId(bookmarkInfo.id)
  }
  handleRowMouseLeave = () => {
    this.toggleBookmarkTree.cancel()
    this.props.removeFocusId()
  }

  noRowsRenderer = () => {
    if (this.props.isSearching) return <NoSearchResult />
    return null
  }

  _toggleBookmarkTree = (bookmarkInfo: BookmarkInfo) => {
    if (bookmarkInfo.type === CST.TYPE_FOLDER && bookmarkInfo.id !== this.context.activeKey) {
      this.props.openBookmarkTree(bookmarkInfo.id, this.props.treeInfo.parent.id)
    } else {
      this.closeNextTrees()
    }
  }
  toggleBookmarkTree = debounce(this._toggleBookmarkTree, TOGGLE_BOOKMARK_TREE_TIMEOUT)

  render = () => (
    <BookmarkTree
      highlightedId={this.props.highlightedId}
      iconSize={this.props.iconSize}
      isDisableDragging={this.props.isSearching}
      isShowCover={this.props.isShowCover}
      isShowHeader={this.props.isShowHeader}
      listItemWidth={this.props.listItemWidth}
      noRowsRenderer={this.noRowsRenderer}
      onCloseButtonClick={this.closeCurrentTree}
      onCoverClick={this.closeNextTrees}
      onRowAuxClick={this.handleRowAuxClick}
      onRowClick={this.handleRowClick}
      onRowDragOver={this.handleRowDragOver}
      onRowDragStart={this.handleRowDragStart}
      onRowMouseEnter={this.handleRowMouseEnter}
      onRowMouseLeave={this.handleRowMouseLeave}
      rowHeight={this.props.rowHeight}
      scrollToIndex={this.props.highlightedIndex}
      treeInfo={this.props.treeInfo}
    />
  )
}

const getIconSize = R.max(CST.MIN_BOOKMARK_ICON_SIZE)
const getRowHeight = (fontSize) =>
  getIconSize(fontSize) +
  // +1 for border width, GOLDEN_GAP for padding
  (1 + CST.GOLDEN_GAP) * 2

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  const highlightedId = state.bookmark.focusId || state.menu.targetId || state.editor.targetId
  const treeIndex = state.bookmark.trees.findIndex(R.pathEq(['parent', 'id'], ownProps.treeId))
  const treeInfo = state.bookmark.trees[treeIndex]
  return {
    highlightedId,
    highlightedIndex: treeInfo.children.findIndex(R.propEq('id', highlightedId)),
    iconSize: getIconSize(state.options.fontSize),
    isSearching: Boolean(state.bookmark.searchKeyword),
    // cover the folder if it is not the top two folder
    isShowCover: state.bookmark.trees.length - treeIndex > 2,
    isShowHeader: treeIndex !== 0,
    listItemWidth: state.options.setWidth,
    rowHeight: getRowHeight(state.options.fontSize),
    treeInfo
  }
}

const mapDispatchToProps = {
  openBookmarksInBrowser: bookmarkCreators.openBookmarksInBrowser,
  openBookmarkTree: bookmarkCreators.openBookmarkTree,
  openMenu: menuCreators.openMenu,
  removeBookmarkTree: bookmarkCreators.removeBookmarkTree,
  removeDragIndicator: bookmarkCreators.removeDragIndicator,
  removeFocusId: bookmarkCreators.removeFocusId,
  removeNextBookmarkTrees: bookmarkCreators.removeNextBookmarkTrees,
  setDragIndicator: bookmarkCreators.setDragIndicator,
  setFocusId: bookmarkCreators.setFocusId
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarkTreeContainer)
