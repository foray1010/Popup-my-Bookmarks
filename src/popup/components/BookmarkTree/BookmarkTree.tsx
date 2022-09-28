import * as React from 'react'
import { useVirtual } from 'react-virtual'
import useEventListener from 'use-typed-event-listener'

import PlainList from '../../../core/components/baseItems/PlainList'
import * as CST from '../../constants'
import type {
  BookmarkInfo,
  BookmarkTree as BookmarkTreeType,
} from '../../types'
import type { ResponseEvent } from '../dragAndDrop'
import { useDragAndDropContainerEvents } from '../dragAndDrop'
import classes from './bookmark-tree.module.css'
import BookmarkRow from './BookmarkRow'

interface ItemData {
  readonly draggingId: string | null
  readonly highlightedId?: string
  readonly isDisableDragAndDrop: boolean
  readonly isSearching: boolean
  readonly isShowTooltip: boolean
  readonly onRowAuxClick: (
    bookmarkInfo: BookmarkInfo,
  ) => React.MouseEventHandler
  readonly onRowClick: (bookmarkInfo: BookmarkInfo) => React.MouseEventHandler
  readonly onRowDragOver: (
    bookmarkInfo: BookmarkInfo,
  ) => (evt: React.MouseEvent, responseEvent: ResponseEvent) => void
  readonly onRowDragStart: React.MouseEventHandler
  readonly onRowMouseEnter: (
    bookmarkInfo: BookmarkInfo,
  ) => React.MouseEventHandler
  readonly onRowMouseLeave: (
    bookmarkInfo: BookmarkInfo,
  ) => React.MouseEventHandler
  readonly treeInfo: BookmarkTreeType
}

type Props = ItemData & {
  readonly lastScrollTop?: number
  readonly listItemWidth: number
  noRowsRenderer(): React.ReactElement | null
  readonly onScroll?: React.UIEventHandler
  readonly scrollToIndex?: number
}
export default function BookmarkTree(props: Props) {
  const parentRef = React.useRef<HTMLDivElement>(null)

  const keyExtractor = React.useCallback(
    (index: number): string => props.treeInfo.children[index].id,
    [props.treeInfo.children],
  )
  const rowVirtualizer = useVirtual({
    size: props.treeInfo.children.length,
    parentRef,
    keyExtractor,
  })

  const [maxListHeight, setMaxListHeight] = React.useState(0)
  React.useEffect(() => {
    if (!parentRef.current) return

    setMaxListHeight(
      CST.MAX_HEIGHT - parentRef.current.getBoundingClientRect().top,
    )
  }, [])

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
        maxHeight: `${maxListHeight}px`,
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
              key={virtualItem.key}
              ref={virtualItem.measureRef}
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
