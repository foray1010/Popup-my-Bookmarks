import classNames from 'classix'
import {
  type DragEventHandler,
  type FC,
  type JSX,
  type MouseEvent,
  type MouseEventHandler,
  useMemo,
} from 'react'
import type { Merge } from 'type-fest'

import { BOOKMARK_TYPES } from '@/popup/modules/bookmarks/constants.js'
import type { BookmarkInfo } from '@/popup/modules/bookmarks/types.js'

import {
  DragAndDropConsumer,
  type ResponseEvent,
} from '../../dragAndDrop/index.js'
import * as classes from './bookmark-row.module.css'
import BookmarkRow from './BookmarkRow.js'
import useTooltip from './useTooltip.js'

type Props = Merge<
  JSX.IntrinsicElements['li'],
  {
    bookmarkInfo: BookmarkInfo
    isDisableDragAndDrop: boolean
    isHighlighted: boolean
    isSearching: boolean
    isShowTooltip: boolean
    isUnclickable: boolean
    onAuxClick: (bookmarkInfo: BookmarkInfo) => MouseEventHandler
    onClick: (bookmarkInfo: BookmarkInfo) => MouseEventHandler
    onContextMenu: (bookmarkInfo: BookmarkInfo) => MouseEventHandler
    onDragOver: (
      bookmarkInfo: BookmarkInfo,
    ) => (evt: Readonly<MouseEvent>, responseEvent: ResponseEvent) => void
    onDragStart: DragEventHandler
    onMouseEnter: (bookmarkInfo: BookmarkInfo) => MouseEventHandler
    onMouseLeave: (bookmarkInfo: BookmarkInfo) => MouseEventHandler
  }
>
const BookmarkRowContainer: FC<Props> = ({
  bookmarkInfo,
  isDisableDragAndDrop,
  isHighlighted,
  isSearching,
  isShowTooltip,
  isUnclickable,
  onAuxClick,
  onClick,
  onContextMenu,
  onDragOver,
  onDragStart,
  onMouseEnter,
  onMouseLeave,
  ...liProps
}) => {
  const tooltip = useTooltip({
    isSearching,
    isShowTooltip,
    bookmarkInfo,
  })

  const handleAuxClick = useMemo(
    () => onAuxClick(bookmarkInfo),
    [bookmarkInfo, onAuxClick],
  )
  const handleClick = useMemo(
    () => onClick(bookmarkInfo),
    [bookmarkInfo, onClick],
  )
  const handleContextMenu = useMemo(
    () => onContextMenu(bookmarkInfo),
    [bookmarkInfo, onContextMenu],
  )
  const handleDragOver = useMemo(
    () => onDragOver(bookmarkInfo),
    [bookmarkInfo, onDragOver],
  )
  const handleMouseEnter = useMemo(
    () => onMouseEnter(bookmarkInfo),
    [bookmarkInfo, onMouseEnter],
  )
  const handleMouseLeave = useMemo(
    () => onMouseLeave(bookmarkInfo),
    [bookmarkInfo, onMouseLeave],
  )

  const isSeparator = bookmarkInfo.type === BOOKMARK_TYPES.SEPARATOR

  return (
    <li data-bookmarkid={bookmarkInfo.id} {...liProps}>
      <DragAndDropConsumer
        disableDrag={
          isDisableDragAndDrop ||
          bookmarkInfo.isRoot ||
          bookmarkInfo.type === BOOKMARK_TYPES.NO_BOOKMARK
        }
        disableDrop={isDisableDragAndDrop}
        itemKey={bookmarkInfo.id}
        onDragOver={handleDragOver}
        onDragStart={onDragStart}
      >
        <BookmarkRow
          className={classNames(
            bookmarkInfo.isRoot && classes['root-folder'],
            bookmarkInfo.type === BOOKMARK_TYPES.DRAG_INDICATOR &&
              classes['drag-indicator'],
            isSeparator && classes.separator,
          )}
          iconUrl={bookmarkInfo.iconUrl}
          isHighlighted={isHighlighted}
          isUnclickable={isUnclickable}
          role={isSeparator ? 'separator' : undefined}
          title={bookmarkInfo.title}
          tooltip={tooltip}
          onAuxClick={handleAuxClick}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </DragAndDropConsumer>
    </li>
  )
}
export default BookmarkRowContainer
