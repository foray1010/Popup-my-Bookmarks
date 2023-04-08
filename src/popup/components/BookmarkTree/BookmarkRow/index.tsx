import classNames from 'classix'
import * as React from 'react'

import { BOOKMARK_TYPES } from '../../../constants/index.js'
import type { BookmarkInfo } from '../../../types/index.js'
import {
  DragAndDropConsumer,
  type ResponseEvent,
} from '../../dragAndDrop/index.js'
import classes from './bookmark-row.module.css'
import BookmarkRow from './BookmarkRow.js'
import useTooltip from './useTooltip.js'

interface Props {
  readonly bookmarkInfo: BookmarkInfo
  readonly className?: string | undefined
  readonly isDisableDragAndDrop: boolean
  readonly isHighlighted: boolean
  readonly isSearching: boolean
  readonly isShowTooltip: boolean
  readonly isUnclickable: boolean
  readonly onAuxClick: (bookmarkInfo: BookmarkInfo) => React.MouseEventHandler
  readonly onClick: (bookmarkInfo: BookmarkInfo) => React.MouseEventHandler
  readonly onContextMenu: (
    bookmarkInfo: BookmarkInfo,
  ) => React.MouseEventHandler
  readonly onDragOver: (
    bookmarkInfo: BookmarkInfo,
  ) => (evt: React.MouseEvent, responseEvent: ResponseEvent) => void
  readonly onDragStart: React.DragEventHandler
  readonly onMouseEnter: (bookmarkInfo: BookmarkInfo) => React.MouseEventHandler
  readonly onMouseLeave: (bookmarkInfo: BookmarkInfo) => React.MouseEventHandler
  readonly style?: React.CSSProperties
}
const BookmarkRowContainer = React.forwardRef(
  function InnerBookmarkRowContainer(
    {
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
    }: Props,
    setRef: React.Ref<HTMLLIElement>,
  ) {
    const tooltip = useTooltip({
      isSearching,
      isShowTooltip,
      bookmarkInfo,
    })

    const handleAuxClick = React.useMemo(
      () => onAuxClick(bookmarkInfo),
      [bookmarkInfo, onAuxClick],
    )
    const handleClick = React.useMemo(
      () => onClick(bookmarkInfo),
      [bookmarkInfo, onClick],
    )
    const handleContextMenu = React.useMemo(
      () => onContextMenu(bookmarkInfo),
      [bookmarkInfo, onContextMenu],
    )
    const handleDragOver = React.useMemo(
      () => onDragOver(bookmarkInfo),
      [bookmarkInfo, onDragOver],
    )
    const handleMouseEnter = React.useMemo(
      () => onMouseEnter(bookmarkInfo),
      [bookmarkInfo, onMouseEnter],
    )
    const handleMouseLeave = React.useMemo(
      () => onMouseLeave(bookmarkInfo),
      [bookmarkInfo, onMouseLeave],
    )

    const isSeparator = bookmarkInfo.type === BOOKMARK_TYPES.SEPARATOR

    return (
      <li ref={setRef} data-bookmarkid={bookmarkInfo.id} {...liProps}>
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
              isSeparator && classes['separator'],
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
  },
)
export default BookmarkRowContainer
