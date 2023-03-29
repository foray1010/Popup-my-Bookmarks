import classNames from 'clsx'
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
  readonly onDragOver: (
    bookmarkInfo: BookmarkInfo,
  ) => (evt: React.MouseEvent, responseEvent: ResponseEvent) => void
  readonly onDragStart: React.MouseEventHandler
  readonly onMouseEnter: (bookmarkInfo: BookmarkInfo) => React.MouseEventHandler
  readonly onMouseLeave: (bookmarkInfo: BookmarkInfo) => React.MouseEventHandler
  readonly style?: React.CSSProperties
}
const BookmarkRowContainer = React.forwardRef(
  function InnerBookmarkRowContainer(
    {
      bookmarkInfo,
      isHighlighted,
      onAuxClick,
      onClick,
      onDragOver,
      onMouseEnter,
      onMouseLeave,
      ...restProps
    }: Props,
    setRef: React.Ref<HTMLLIElement>,
  ) {
    const tooltip = useTooltip({
      isSearching: restProps.isSearching,
      isShowTooltip: restProps.isShowTooltip,
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
      <li
        ref={setRef}
        className={restProps.className}
        data-bookmarkid={bookmarkInfo.id}
        style={restProps.style}
      >
        <DragAndDropConsumer
          disableDrag={
            restProps.isDisableDragAndDrop ||
            bookmarkInfo.isRoot ||
            bookmarkInfo.type === BOOKMARK_TYPES.NO_BOOKMARK
          }
          disableDrop={restProps.isDisableDragAndDrop}
          itemKey={bookmarkInfo.id}
          onDragOver={handleDragOver}
          onDragStart={restProps.onDragStart}
        >
          <BookmarkRow
            className={classNames({
              [classes['root-folder'] as string]: bookmarkInfo.isRoot,
              [classes['drag-indicator'] as string]:
                bookmarkInfo.type === BOOKMARK_TYPES.DRAG_INDICATOR,
              [classes['separator'] as string]: isSeparator,
            })}
            iconUrl={bookmarkInfo.iconUrl}
            isHighlighted={isHighlighted}
            isUnclickable={restProps.isUnclickable}
            role={isSeparator ? 'separator' : undefined}
            title={bookmarkInfo.title}
            tooltip={tooltip}
            onAuxClick={handleAuxClick}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </DragAndDropConsumer>
      </li>
    )
  },
)
export default BookmarkRowContainer
