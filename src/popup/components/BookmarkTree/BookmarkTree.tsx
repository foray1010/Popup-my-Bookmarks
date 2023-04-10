import { useVirtualizer } from '@tanstack/react-virtual'
import classNames from 'classix'
import * as React from 'react'
import useEventListener from 'use-typed-event-listener'

import PlainList from '../../../core/components/baseItems/PlainList/index.js'
import { MAX_HEIGHT, OPTIONS } from '../../constants/index.js'
import { useOptions } from '../../modules/options.js'
import type { BookmarkInfo, BookmarkTreeInfo } from '../../types/index.js'
import {
  type ResponseEvent,
  useDragAndDropContainerEvents,
} from '../dragAndDrop/index.js'
import classes from './bookmark-tree.module.css'
import BookmarkRow from './BookmarkRow/index.js'

type Props = {
  readonly draggingId: string | null
  readonly highlightedId?: string | undefined
  readonly isDisableDragAndDrop: boolean
  readonly isSearching: boolean
  readonly isShowTooltip: boolean
  readonly lastScrollTop?: number | undefined
  readonly noRowsRenderer: () => React.ReactElement | null
  readonly onRowAuxClick: (
    bookmarkInfo: BookmarkInfo,
  ) => React.MouseEventHandler
  readonly onRowClick: (bookmarkInfo: BookmarkInfo) => React.MouseEventHandler
  readonly onRowContextMenu: (
    bookmarkInfo: BookmarkInfo,
  ) => React.MouseEventHandler
  readonly onRowDragOver: (
    bookmarkInfo: BookmarkInfo,
  ) => (evt: React.MouseEvent, responseEvent: ResponseEvent) => void
  readonly onRowDragStart: React.DragEventHandler
  readonly onRowMouseEnter: (
    bookmarkInfo: BookmarkInfo,
  ) => React.MouseEventHandler
  readonly onRowMouseLeave: (
    bookmarkInfo: BookmarkInfo,
  ) => React.MouseEventHandler
  readonly onScroll?: React.UIEventHandler
  readonly scrollToIndex?: number | undefined
  readonly treeInfo: BookmarkTreeInfo
}
export default function BookmarkTree(props: Props) {
  const options = useOptions()

  const parentRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: props.treeInfo.children.length,
    getItemKey: (index) => props.treeInfo.children[index]!.id,
    getScrollElement: () => parentRef.current,
    // rough row height
    estimateSize: () => options[OPTIONS.FONT_SIZE] / 0.6,
  })

  const [maxListHeight, setMaxListHeight] = React.useState(0)
  React.useLayoutEffect(() => {
    if (!parentRef.current) return

    setMaxListHeight(MAX_HEIGHT - parentRef.current.getBoundingClientRect().top)
  }, [])

  const { scrollToIndex, scrollToOffset } = virtualizer
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
        overflow: 'auto',
      }}
      onScroll={props.onScroll}
    >
      <PlainList
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          contain: 'strict',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const bookmarkInfo = props.treeInfo.children[virtualItem.index]
          if (!bookmarkInfo) return null

          const isDragging = props.draggingId !== null
          const isBeingDragged = props.draggingId === bookmarkInfo.id
          return (
            <BookmarkRow
              key={virtualItem.key}
              ref={virtualizer.measureElement}
              bookmarkInfo={bookmarkInfo}
              className={classNames(
                classes['react-virtual-row'],
                virtualItem.index === itemCount - 1 &&
                  classes['last-list-item'],
              )}
              data-index={virtualItem.index} // used by @tanstack/react-virtual to measure the height
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
                transform: `translateY(${virtualItem.start}px)`,
              }}
              onAuxClick={props.onRowAuxClick}
              onClick={props.onRowClick}
              onContextMenu={props.onRowContextMenu}
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
