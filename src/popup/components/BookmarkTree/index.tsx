import * as React from 'react'
import { shallowEqual, useSelector } from 'react-redux'

import useAction from '../../../core/hooks/useAction'
import * as CST from '../../constants'
import type { RootState } from '../../reduxs'
import { bookmarkCreators } from '../../reduxs'
import { useDragAndDropContext } from '../dragAndDrop/DragAndDropContext'
import { useListNavigationContext } from '../listNavigation/ListNavigationContext'
import Mask from '../Mask'
import classes from './bookmark-tree.css'
import BookmarkTree from './BookmarkTree'
import NoSearchResult from './NoSearchResult'
import TreeHeader from './TreeHeader'
import useRowClickEvents from './useRowClickEvents'
import useRowDragEvents from './useRowDragEvents'
import useRowHoverEvents from './useRowHoverEvents'

const getIconSize = (iconSize: number) =>
  Math.max(iconSize, CST.MIN_BOOKMARK_ICON_SIZE)
const getRowHeight = (fontSize: number) =>
  getIconSize(fontSize) +
  // +1 for border width, GOLDEN_GAP for padding
  (1 + CST.GOLDEN_GAP) * 2

const useReduxProps = ({ treeId }: { treeId: string }) => {
  const reduxSelector = React.useCallback(
    (state: RootState) => {
      const treeIndex = state.bookmark.trees.findIndex(
        (tree) => tree.parent.id === treeId,
      )
      const treeInfo = state.bookmark.trees[treeIndex]

      return {
        iconSize: getIconSize(state.options[CST.OPTIONS.FONT_SIZE] ?? 0),
        isSearching: Boolean(state.bookmark.searchKeyword),
        // cover the folder if it is not the top two folder
        isShowCover: state.bookmark.trees.length - treeIndex > 2,
        isShowHeader: treeIndex !== 0,
        isShowTooltip: Boolean(state.options[CST.OPTIONS.TOOLTIP]),
        listItemWidth: state.options[CST.OPTIONS.SET_WIDTH] ?? 0,
        rowHeight: getRowHeight(state.options[CST.OPTIONS.FONT_SIZE] ?? 0),
        treeIndex,
        treeInfo,
      }
    },
    [treeId],
  )

  return useSelector(reduxSelector, shallowEqual)
}

interface Props {
  treeId: string
  scrollTop?: number
  registerLastPosition: (index: number, id: string) => void
  unregisterLastPosition: (id: string) => void
  updateLastPosition: (id: string, scrollTop: number) => void
}
const BookmarkTreeContainer = ({
  treeId,
  scrollTop,
  registerLastPosition,
  unregisterLastPosition,
  updateLastPosition,
}: Props) => {
  const {
    isSearching,
    isShowCover,
    isShowHeader,
    treeIndex,
    treeInfo,
    ...bookmarkTreeProps
  } = useReduxProps({
    treeId,
  })

  const removeBookmarkTree = useAction(bookmarkCreators.removeBookmarkTree)
  const removeNextBookmarkTrees = useAction(
    bookmarkCreators.removeNextBookmarkTrees,
  )

  const { activeKey } = useDragAndDropContext()
  const { lists, setItemCount, removeList } = useListNavigationContext()

  React.useEffect(() => {
    setItemCount(treeIndex, treeInfo.children.length)

    return () => {
      removeList(treeIndex)
    }
  }, [treeIndex, treeInfo.children.length, setItemCount, removeList])

  React.useEffect(() => {
    registerLastPosition(treeIndex, treeId)

    return () => {
      unregisterLastPosition(treeId)
    }
  }, [registerLastPosition, treeId, treeIndex, unregisterLastPosition])

  const highlightedIndex = lists.highlightedIndices.get(treeIndex)
  const highlightedId =
    highlightedIndex !== undefined
      ? treeInfo.children[highlightedIndex]?.id
      : undefined

  const closeCurrentTree = React.useCallback(() => {
    removeBookmarkTree(treeInfo.parent.id)
  }, [removeBookmarkTree, treeInfo.parent.id])
  const closeNextTrees = React.useCallback(() => {
    removeNextBookmarkTrees(treeInfo.parent.id)
  }, [removeNextBookmarkTrees, treeInfo.parent.id])

  const { handleRowAuxClick, handleRowClick } = useRowClickEvents({
    treeInfo,
  })
  const { handleRowDragOver, handleRowDragStart } = useRowDragEvents({
    closeNextTrees,
    treeInfo,
  })
  const { handleRowMouseEnter, handleRowMouseLeave } = useRowHoverEvents({
    closeNextTrees,
    treeIndex,
    treeInfo,
  })

  return (
    <section className={classes.main}>
      {isShowHeader && (
        <TreeHeader title={treeInfo.parent.title} onClose={closeCurrentTree} />
      )}

      <BookmarkTree
        {...bookmarkTreeProps}
        draggingId={activeKey}
        highlightedId={highlightedId}
        isDisableDragAndDrop={isSearching}
        isSearching={isSearching}
        lastScrollTop={scrollTop}
        noRowsRenderer={React.useCallback(
          () => (isSearching ? <NoSearchResult /> : null),
          [isSearching],
        )}
        scrollToIndex={highlightedIndex}
        treeInfo={treeInfo}
        onRowAuxClick={handleRowAuxClick}
        onRowClick={handleRowClick}
        onRowDragOver={handleRowDragOver}
        onRowDragStart={handleRowDragStart}
        onRowMouseEnter={handleRowMouseEnter}
        onRowMouseLeave={handleRowMouseLeave}
        onScroll={React.useCallback<React.UIEventHandler>(
          (evt) => {
            updateLastPosition(treeId, evt.currentTarget.scrollTop)
          },
          [updateLastPosition, treeId],
        )}
      />

      {isShowCover && <Mask opacity={0.7} onClick={closeNextTrees} />}
    </section>
  )
}

export default BookmarkTreeContainer
