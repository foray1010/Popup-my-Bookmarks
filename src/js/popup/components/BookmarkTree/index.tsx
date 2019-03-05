import debounce from 'lodash.debounce'
import * as R from 'ramda'
import * as React from 'react'
import {connect} from 'react-redux'

import * as CST from '../../constants'
import {RootState, bookmarkCreators, menuCreators} from '../../reduxs'
import {BookmarkInfo} from '../../types'
import {ResponseEvent} from '../dragAndDrop/DragAndDropConsumer'
import DragAndDropContext, {ContextType} from '../dragAndDrop/DragAndDropContext'
import BookmarkTree from './BookmarkTree'
import NoSearchResult from './NoSearchResult'

interface OwnProps {
  treeId: string
}

const getIconSize = (iconSize: number) => Math.max(iconSize, CST.MIN_BOOKMARK_ICON_SIZE)
const getRowHeight = (fontSize: number) =>
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
    iconSize: getIconSize(state.options.fontSize || 0),
    isSearching: Boolean(state.bookmark.searchKeyword),
    // cover the folder if it is not the top two folder
    isShowCover: state.bookmark.trees.length - treeIndex > 2,
    isShowHeader: treeIndex !== 0,
    listItemWidth: state.options.setWidth,
    rowHeight: getRowHeight(state.options.fontSize || 0),
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

type Props = OwnProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
class BookmarkTreeContainer extends React.PureComponent<Props> {
  public context: ContextType
  public static contextType = DragAndDropContext

  private closeCurrentTree = () => {
    this.props.removeBookmarkTree(this.props.treeInfo.parent.id)
  }
  private closeNextTrees = () => {
    this.props.removeNextBookmarkTrees(this.props.treeInfo.parent.id)
  }

  // to support `chrome < 55` as auxclick is not available
  private _handleRowAllClick = (bookmarkId: string, evt: React.MouseEvent | MouseEvent) => {
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
  private _handleRowLeftClick = (bookmarkId: string) => {
    this.props.openBookmarksInBrowser([bookmarkId], CST.OPEN_IN_TYPES.CURRENT_TAB, true)
  }
  private _handleRowMiddleClick = (bookmarkId: string) => {
    this.props.openBookmarksInBrowser([bookmarkId], CST.OPEN_IN_TYPES.NEW_TAB, true)
  }
  private _handleRowRightClick = (bookmarkId: string, evt: React.MouseEvent | MouseEvent) => {
    if (!(evt.currentTarget instanceof HTMLElement)) return

    const targetOffset = evt.currentTarget.getBoundingClientRect()
    this.props.openMenu(bookmarkId, {
      positionLeft: evt.clientX,
      positionTop: evt.clientY,
      targetLeft: targetOffset.left,
      targetTop: targetOffset.top
    })
  }
  private handleRowAuxClick = (bookmarkId: string) => (evt: MouseEvent) => {
    this._handleRowAllClick(bookmarkId, evt)
  }
  private handleRowClick = (bookmarkId: string) => (evt: React.MouseEvent<HTMLElement>) => {
    this._handleRowAllClick(bookmarkId, evt)
  }
  private handleRowDragOver = (bookmarkInfo: BookmarkInfo) => (
    evt: React.MouseEvent<HTMLElement>,
    responseEvent: ResponseEvent
  ) => {
    const targetOffset = evt.currentTarget.getBoundingClientRect()
    const isOverBottomPart = evt.clientY - targetOffset.top > targetOffset.height / 2

    const childrenWithoutDragIndicator = this.props.treeInfo.children.filter(
      (child) => child.type !== CST.BOOKMARK_TYPES.DRAG_INDICATOR
    )

    const activeIndex = childrenWithoutDragIndicator.findIndex(
      (item) => item.id === responseEvent.activeKey
    )
    const currentIndex = childrenWithoutDragIndicator.findIndex(
      (item) => item.id === responseEvent.itemKey
    )
    const targetIndex = currentIndex + (isOverBottomPart ? 1 : 0)

    const isNearActiveItem =
      activeIndex === -1 ? false : [activeIndex, activeIndex + 1].includes(targetIndex)
    if (isNearActiveItem) {
      console.debug('skip as nearby active item')
      this.props.removeDragIndicator()
      return
    }

    this.props.setDragIndicator(bookmarkInfo.parentId, targetIndex)
  }
  private handleRowDragStart = () => {
    this.closeNextTrees()
  }
  private handleRowMouseEnter = (bookmarkInfo: BookmarkInfo) => () => {
    this.toggleBookmarkTree(bookmarkInfo)
    this.props.setFocusId(bookmarkInfo.id)
  }
  private handleRowMouseLeave = () => {
    this.toggleBookmarkTree.cancel()
    this.props.removeFocusId()
  }

  private noRowsRenderer = () => {
    if (this.props.isSearching) return <NoSearchResult />
    return null
  }

  private _toggleBookmarkTree = (bookmarkInfo: BookmarkInfo) => {
    if (
      bookmarkInfo.type === CST.BOOKMARK_TYPES.FOLDER &&
      bookmarkInfo.id !== this.context.activeKey
    ) {
      this.props.openBookmarkTree(bookmarkInfo.id, this.props.treeInfo.parent.id)
    } else {
      this.closeNextTrees()
    }
  }
  private toggleBookmarkTree = debounce(this._toggleBookmarkTree, 300)

  public render = () => (
    <BookmarkTree
      draggingId={this.context.activeKey}
      highlightedId={this.props.highlightedId}
      iconSize={this.props.iconSize}
      isDisableDragAndDrop={this.props.isSearching}
      isShowCover={this.props.isShowCover}
      isShowHeader={this.props.isShowHeader}
      listItemWidth={this.props.listItemWidth || 0}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarkTreeContainer)
