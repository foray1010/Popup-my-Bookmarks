import * as R from 'ramda'
import * as React from 'react'
import {connect} from 'react-redux'

import classes from '../../../../css/popup/bookmark-tree.css'
import * as CST from '../../constants'
import {RootState, bookmarkCreators, menuCreators} from '../../reduxs'
import DragAndDropContext from '../dragAndDrop/DragAndDropContext'
import Mask from '../Mask'
import BookmarkTree from './BookmarkTree'
import NoSearchResult from './NoSearchResult'
import TreeHeader from './TreeHeader'
import useRowClickEvents from './useRowClickEvents'
import useRowDragEvents from './useRowDragEvents'
import useRowHoverEvents from './useRowHoverEvents'

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
const BookmarkTreeContainer = (props: Props) => {
  const {isSearching, removeBookmarkTree, removeNextBookmarkTrees, treeInfo} = props

  const context = React.useContext(DragAndDropContext)

  const closeCurrentTree = React.useCallback(() => {
    removeBookmarkTree(treeInfo.parent.id)
  }, [removeBookmarkTree, treeInfo.parent.id])
  const closeNextTrees = React.useCallback(() => {
    removeNextBookmarkTrees(treeInfo.parent.id)
  }, [removeNextBookmarkTrees, treeInfo.parent.id])
  const noRowsRenderer = React.useCallback(() => {
    return isSearching ? <NoSearchResult /> : null
  }, [isSearching])

  const {handleRowAuxClick, handleRowClick} = useRowClickEvents(props)
  const {handleRowDragOver, handleRowDragStart} = useRowDragEvents({...props, closeNextTrees})
  const {handleRowMouseEnter, handleRowMouseLeave} = useRowHoverEvents({...props, closeNextTrees})

  return (
    <section className={classes.main}>
      {props.isShowHeader && (
        <TreeHeader title={props.treeInfo.parent.title} onClose={closeCurrentTree} />
      )}

      <BookmarkTree
        draggingId={context.activeKey}
        highlightedId={props.highlightedId}
        iconSize={props.iconSize}
        isDisableDragAndDrop={props.isSearching}
        listItemWidth={props.listItemWidth || 0}
        noRowsRenderer={noRowsRenderer}
        onRowAuxClick={handleRowAuxClick}
        onRowClick={handleRowClick}
        onRowDragOver={handleRowDragOver}
        onRowDragStart={handleRowDragStart}
        onRowMouseEnter={handleRowMouseEnter}
        onRowMouseLeave={handleRowMouseLeave}
        rowHeight={props.rowHeight}
        scrollToIndex={props.highlightedIndex}
        treeInfo={props.treeInfo}
      />

      {props.isShowCover && <Mask backgroundColor='#000' opacity={0.16} onClick={closeNextTrees} />}
    </section>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarkTreeContainer)
