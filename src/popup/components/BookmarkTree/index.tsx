import * as R from 'ramda'
import * as React from 'react'
import {shallowEqual, useSelector} from 'react-redux'

import useAction from '../../../core/hooks/useAction'
import * as CST from '../../constants'
import {RootState, bookmarkCreators} from '../../reduxs'
import DragAndDropContext from '../dragAndDrop/DragAndDropContext'
import ListNavigationContext from '../listNavigation/ListNavigationContext'
import Mask from '../Mask'
import classes from './bookmark-tree.css'
import BookmarkTree from './BookmarkTree'
import NoSearchResult from './NoSearchResult'
import TreeHeader from './TreeHeader'
import useRememberLastPositions from './useRememberLastPositions'
import useRowClickEvents from './useRowClickEvents'
import useRowDragEvents from './useRowDragEvents'
import useRowHoverEvents from './useRowHoverEvents'

const getIconSize = (iconSize: number) => Math.max(iconSize, CST.MIN_BOOKMARK_ICON_SIZE)
const getRowHeight = (fontSize: number) =>
  getIconSize(fontSize) +
  // +1 for border width, GOLDEN_GAP for padding
  (1 + CST.GOLDEN_GAP) * 2

const useReduxState = ({treeId}: {treeId: string}) => {
  const reduxSelector = React.useCallback(
    (state: RootState) => {
      const treeIndex = state.bookmark.trees.findIndex(R.pathEq(['parent', 'id'], treeId))
      const treeInfo = state.bookmark.trees[treeIndex]

      const isRememberLastPositions = Boolean(state.options[CST.OPTIONS.REMEMBER_POS])
      const lastPosition = isRememberLastPositions ?
        (state.lastPositions || []).find(R.propEq('id', treeId)) :
        undefined

      return {
        iconSize: getIconSize(state.options[CST.OPTIONS.FONT_SIZE] || 0),
        isRememberLastPositions,
        isSearching: Boolean(state.bookmark.searchKeyword),
        // cover the folder if it is not the top two folder
        isShowCover: state.bookmark.trees.length - treeIndex > 2,
        isShowHeader: treeIndex !== 0,
        isShowTooltip: Boolean(state.options[CST.OPTIONS.TOOLTIP]),
        lastScrollTop: lastPosition ? lastPosition.scrollTop : undefined,
        listItemWidth: state.options[CST.OPTIONS.SET_WIDTH] || 0,
        rowHeight: getRowHeight(state.options[CST.OPTIONS.FONT_SIZE] || 0),
        treeIndex,
        treeInfo
      }
    },
    [treeId]
  )

  return useSelector(reduxSelector, shallowEqual)
}

interface Props {
  treeId: string
}
const BookmarkTreeContainer = ({treeId}: Props) => {
  const {isRememberLastPositions, isSearching, treeIndex, treeInfo, ...props} = useReduxState({
    treeId
  })

  const removeBookmarkTree = useAction(bookmarkCreators.removeBookmarkTree)
  const removeNextBookmarkTrees = useAction(bookmarkCreators.removeNextBookmarkTrees)

  const {activeKey} = React.useContext(DragAndDropContext)
  const {lists, setItemCount, removeList} = React.useContext(ListNavigationContext)

  React.useEffect(() => {
    setItemCount(treeIndex, treeInfo.children.length)

    return () => {
      removeList(treeIndex)
    }
  }, [treeIndex, treeInfo.children.length, setItemCount, removeList])

  const highlightedIndex = lists.highlightedIndices.get(treeIndex)
  const highlightedId =
    highlightedIndex !== undefined ? R.prop('id', treeInfo.children[highlightedIndex]) : undefined

  const closeCurrentTree = React.useCallback(() => {
    removeBookmarkTree(treeInfo.parent.id)
  }, [removeBookmarkTree, treeInfo.parent.id])
  const closeNextTrees = React.useCallback(() => {
    removeNextBookmarkTrees(treeInfo.parent.id)
  }, [removeNextBookmarkTrees, treeInfo.parent.id])
  const noRowsRenderer = React.useCallback(() => {
    return isSearching ? <NoSearchResult /> : null
  }, [isSearching])

  const {handleScroll} = useRememberLastPositions({
    isRememberLastPositions,
    treeId,
    treeIndex
  })
  const {handleRowAuxClick, handleRowClick} = useRowClickEvents({
    treeInfo
  })
  const {handleRowDragOver, handleRowDragStart} = useRowDragEvents({
    closeNextTrees,
    treeInfo
  })
  const {handleRowMouseEnter, handleRowMouseLeave} = useRowHoverEvents({
    closeNextTrees,
    treeIndex,
    treeInfo
  })

  return (
    <section className={classes.main}>
      {props.isShowHeader && (
        <TreeHeader title={treeInfo.parent.title} onClose={closeCurrentTree} />
      )}

      <BookmarkTree
        draggingId={activeKey}
        highlightedId={highlightedId}
        iconSize={props.iconSize}
        isDisableDragAndDrop={isSearching}
        isSearching={isSearching}
        isShowTooltip={props.isShowTooltip}
        lastScrollTop={props.lastScrollTop}
        listItemWidth={props.listItemWidth}
        noRowsRenderer={noRowsRenderer}
        onRowAuxClick={handleRowAuxClick}
        onRowClick={handleRowClick}
        onRowDragOver={handleRowDragOver}
        onRowDragStart={handleRowDragStart}
        onRowMouseEnter={handleRowMouseEnter}
        onRowMouseLeave={handleRowMouseLeave}
        onScroll={handleScroll}
        rowHeight={props.rowHeight}
        scrollToIndex={highlightedIndex}
        treeInfo={treeInfo}
      />

      {props.isShowCover && <Mask backgroundColor='#000' opacity={0.16} onClick={closeNextTrees} />}
    </section>
  )
}

export default BookmarkTreeContainer
