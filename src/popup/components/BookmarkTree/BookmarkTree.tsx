import * as React from 'react'
import { useVirtual } from 'react-virtual'
import useEventListener from 'use-typed-event-listener'

import PlainList from '../../../core/components/baseItems/PlainList'
import * as CST from '../../constants'
import type {
  BookmarkInfo,
  BookmarkTree as BookmarkTreeType,
} from '../../types'
import { ResponseEvent, useDragAndDropContainerEvents } from '../dragAndDrop'
import classes from './bookmark-tree.module.css'
import BookmarkRow from './BookmarkRow'

interface ItemData {
  draggingId: string | null
  highlightedId?: string
  isDisableDragAndDrop: boolean
  isSearching: boolean
  isShowTooltip: boolean
  onRowAuxClick(bookmarkInfo: BookmarkInfo): React.MouseEventHandler
  onRowClick(bookmarkInfo: BookmarkInfo): React.MouseEventHandler
  onRowDragOver(
    bookmarkInfo: BookmarkInfo,
  ): (evt: React.MouseEvent, responseEvent: ResponseEvent) => void
  onRowDragStart: React.MouseEventHandler
  onRowMouseEnter(bookmarkInfo: BookmarkInfo): React.MouseEventHandler
  onRowMouseLeave(bookmarkInfo: BookmarkInfo): React.MouseEventHandler
  treeInfo: BookmarkTreeType
}

type Props = ItemData & {
  lastScrollTop?: number
  listItemWidth: number
  noRowsRenderer(): React.ReactElement | null
  onScroll?: React.UIEventHandler
  rowHeight: number
  scrollToIndex?: number
}
export default function BookmarkTree(props: Props) {
  const parentRef = React.useRef<HTMLDivElement>(null)

  const getRowHeight = React.useCallback(
    (index: number) => {
      let rowHeight = props.rowHeight

      const bookmarkInfo = props.treeInfo.children[index]
      if (bookmarkInfo.type === CST.BOOKMARK_TYPES.SEPARATOR) {
        rowHeight /= 2
      }

      // for the indicator show the end of folder
      if (index === props.treeInfo.children.length - 1) {
        rowHeight += CST.GOLDEN_GAP * 2
      }

      return rowHeight
    },
    [props.rowHeight, props.treeInfo.children],
  )

  const rowVirtualizer = useVirtual({
    size: props.treeInfo.children.length,
    parentRef,
    estimateSize: getRowHeight,
  })

  const [listHeight, setListHeight] = React.useState(0)
  React.useEffect(() => {
    if (!parentRef.current) return

    const maxListHeight =
      CST.MAX_HEIGHT - parentRef.current.getBoundingClientRect().top
    const minListHeight = props.rowHeight

    const totalRowHeight = props.treeInfo.children.reduce(
      (acc, _, index) => acc + getRowHeight(index),
      0,
    )

    // @todo use Math.clamp in future
    function clamp(min: number, max: number, value: number): number {
      return Math.min(Math.max(value, min), max)
    }
    setListHeight(clamp(minListHeight, maxListHeight, totalRowHeight))
  }, [getRowHeight, props.rowHeight, props.treeInfo.children])

  const { scrollToIndex, scrollToOffset } = rowVirtualizer
  React.useEffect(() => {
    if (props.lastScrollTop) {
      scrollToOffset(props.lastScrollTop)
    }
  }, [props.lastScrollTop, scrollToOffset])
  React.useEffect(() => {
    if (props.scrollToIndex !== undefined) {
      scrollToIndex(props.scrollToIndex)
    }
  }, [props.scrollToIndex, scrollToIndex])

  const { onMouseMove } = useDragAndDropContainerEvents()
  useEventListener(parentRef.current, 'mousemove', onMouseMove)

  const itemCount = props.treeInfo.children.length
  if (itemCount === 0) {
    return props.noRowsRenderer()
  }

  return (
    <div
      ref={parentRef}
      style={{
        height: `${listHeight}px`,
        width: `${props.listItemWidth}px`,
        overflow: 'auto',
      }}
    >
      <PlainList
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          position: 'relative',
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualItem) => {
          const bookmarkInfo = props.treeInfo.children[virtualItem.index]
          const isDragging = props.draggingId !== null
          const isBeingDragged = props.draggingId === bookmarkInfo.id
          return (
            <BookmarkRow
              key={virtualItem.index}
              bookmarkInfo={bookmarkInfo}
              className={classes.listItem}
              isDisableDragAndDrop={props.isDisableDragAndDrop}
              isHighlighted={
                isDragging
                  ? isBeingDragged
                  : props.highlightedId === bookmarkInfo.id
              }
              isSearching={props.isSearching}
              isShowTooltip={props.isShowTooltip}
              isUnclickable={isBeingDragged}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              onAuxClick={props.onRowAuxClick}
              onClick={props.onRowClick}
              onDragOver={props.onRowDragOver}
              onDragStart={props.onRowDragStart}
              onMouseEnter={props.onRowMouseEnter}
              onMouseLeave={props.onRowMouseLeave}
            />
          )
        })}
      </PlainList>
    </div>
  )
}
