import * as React from 'react'

import * as CST from '../../constants'
import { useBookmarkTrees } from '../../modules/bookmarks/contexts/bookmarkTrees'
import { useOptions } from '../../modules/options'
import { useDragAndDropContext } from '../dragAndDrop'
import { useListNavigationContext } from '../listNavigation'
import Mask from '../Mask'
import classes from './bookmark-tree.module.css'
import BookmarkTree from './BookmarkTree'
import NoSearchResult from './NoSearchResult'
import TreeHeader from './TreeHeader'
import useRowClickEvents from './useRowClickEvents'
import useRowDragEvents from './useRowDragEvents'
import useRowHoverEvents from './useRowHoverEvents'

const useContextProps = ({ treeId }: { readonly treeId: string }) => {
  const options = useOptions()

  const { bookmarkTrees, searchQuery } = useBookmarkTrees()

  const treeIndex = bookmarkTrees.findIndex((tree) => tree.parent.id === treeId)
  const treeInfo = bookmarkTrees[treeIndex]
  if (!treeInfo) throw new Error('cannot find bookmark tree')

  return {
    isSearching: Boolean(searchQuery),
    // cover the folder if it is not the top two folder
    isShowCover: bookmarkTrees.length - treeIndex > 2,
    isShowHeader: treeIndex !== 0,
    isShowTooltip: Boolean(options[CST.OPTIONS.TOOLTIP]),
    listItemWidth: options[CST.OPTIONS.SET_WIDTH] ?? 0,
    treeIndex,
    treeInfo,
  }
}

interface Props {
  readonly treeId: string
  readonly scrollTop?: number | undefined
  readonly registerLastPosition: (index: number, id: string) => void
  readonly unregisterLastPosition: (id: string) => void
  readonly updateLastPosition: (id: string, scrollTop: number) => void
}
export default function BookmarkTreeContainer({
  treeId,
  scrollTop,
  registerLastPosition,
  unregisterLastPosition,
  updateLastPosition,
}: Props) {
  const {
    isSearching,
    isShowCover,
    isShowHeader,
    treeIndex,
    treeInfo,
    ...bookmarkTreeProps
  } = useContextProps({
    treeId,
  })

  const { removeBookmarkTree, removeNextBookmarkTrees } = useBookmarkTrees()

  const { activeKey } = useDragAndDropContext()
  const { listNavigation, setItemCount, removeList } =
    useListNavigationContext()

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

  const highlightedIndex = listNavigation.highlightedIndices.get(treeIndex)
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
    <section className={classes['main']}>
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
