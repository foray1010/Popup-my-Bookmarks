import * as React from 'react'

import { OPTIONS } from '../../../core/constants/index.js'
import { useBookmarkTreesContext } from '../../modules/bookmarks/contexts/bookmarkTrees.js'
import type { BookmarkTreeInfo } from '../../modules/bookmarks/types.js'
import { useRememberLastPosition } from '../../modules/lastPositions/index.js'
import { useOptions } from '../../modules/options.js'
import { useDragAndDropContext } from '../dragAndDrop/index.js'
import { useListNavigationContext } from '../listNavigation/index.js'
import Mask from '../Mask/index.js'
import classes from './bookmark-tree.module.css'
import BookmarkTree from './BookmarkTree.js'
import NoSearchResult from './NoSearchResult.js'
import TreeHeader from './TreeHeader.js'
import useRowClickEvents from './useRowClickEvents.js'
import useRowDragEvents from './useRowDragEvents.js'
import useRowHoverEvents from './useRowHoverEvents.js'

function useBookmarkContextProps({ treeId }: Readonly<{ treeId: string }>) {
  const { bookmarkTrees, searchQuery } = useBookmarkTreesContext()

  const treeIndex = bookmarkTrees.findIndex((tree) => tree.parent.id === treeId)
  const treeInfo = bookmarkTrees[treeIndex]
  if (!treeInfo) throw new Error('cannot find bookmark tree')

  return {
    isSearching: Boolean(searchQuery),
    // cover the folder if it is not the top two folder
    isShowCover: bookmarkTrees.length - treeIndex > 2,
    isShowHeader: treeIndex !== 0,
    treeIndex,
    treeInfo,
  }
}

function useListNavigation({
  treeIndex,
  treeInfo,
}: Readonly<{ treeIndex: number; treeInfo: BookmarkTreeInfo }>) {
  const { listNavigation, setItemCount, removeList } =
    useListNavigationContext()

  React.useEffect(() => {
    setItemCount(treeIndex, treeInfo.children.length)

    return () => {
      removeList(treeIndex)
    }
  }, [treeIndex, treeInfo.children.length, setItemCount, removeList])

  const highlightedIndex = listNavigation.highlightedIndices.get(treeIndex)
  const highlightedId =
    highlightedIndex !== undefined
      ? treeInfo.children[highlightedIndex]?.id
      : undefined

  return {
    highlightedId,
    highlightedIndex,
  }
}

type Props = Readonly<{
  treeId: string
}>
export default function BookmarkTreeContainer({ treeId }: Props) {
  const options = useOptions()

  const { isSearching, isShowCover, isShowHeader, treeIndex, treeInfo } =
    useBookmarkContextProps({ treeId })

  const { removeBookmarkTree, removeNextBookmarkTrees } =
    useBookmarkTreesContext()
  const closeCurrentTree = React.useCallback(() => {
    removeBookmarkTree(treeInfo.parent.id)
  }, [removeBookmarkTree, treeInfo.parent.id])
  const closeNextTrees = React.useCallback(() => {
    removeNextBookmarkTrees(treeInfo.parent.id)
  }, [removeNextBookmarkTrees, treeInfo.parent.id])

  const { activeKey } = useDragAndDropContext()

  const { highlightedId, highlightedIndex } = useListNavigation({
    treeIndex,
    treeInfo,
  })

  const { lastScrollTop, onScroll } = useRememberLastPosition({
    treeIndex,
    treeId,
  })

  const { handleRowAuxClick, handleRowClick, handleRowContextMenu } =
    useRowClickEvents({
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
        draggingId={activeKey}
        highlightedId={highlightedId}
        isDisableDragAndDrop={isSearching}
        isSearching={isSearching}
        isShowTooltip={options[OPTIONS.TOOLTIP]}
        lastScrollTop={lastScrollTop}
        noRowsRenderer={React.useCallback(
          () => (isSearching ? <NoSearchResult /> : null),
          [isSearching],
        )}
        scrollToIndex={highlightedIndex}
        treeInfo={treeInfo}
        onRowAuxClick={handleRowAuxClick}
        onRowClick={handleRowClick}
        onRowContextMenu={handleRowContextMenu}
        onRowDragOver={handleRowDragOver}
        onRowDragStart={handleRowDragStart}
        onRowMouseEnter={handleRowMouseEnter}
        onRowMouseLeave={handleRowMouseLeave}
        onScroll={onScroll}
      />

      {isShowCover && <Mask opacity={0.7} onClick={closeNextTrees} />}
    </section>
  )
}
