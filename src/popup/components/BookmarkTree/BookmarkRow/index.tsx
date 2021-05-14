import classNames from 'clsx'
import * as React from 'react'

import * as CST from '../../../constants'
import type { BookmarkInfo } from '../../../types'
import { DragAndDropConsumer, ResponseEvent } from '../../dragAndDrop'
import classes from './bookmark-row.module.css'
import BookmarkRow from './BookmarkRow'
import useTooltip from './useTooltip'

interface Props {
  bookmarkInfo: BookmarkInfo
  className?: string
  iconSize: number
  isDisableDragAndDrop: boolean
  isHighlighted: boolean
  isSearching: boolean
  isShowTooltip: boolean
  isUnclickable: boolean
  onAuxClick(bookmarkInfo: BookmarkInfo): React.MouseEventHandler
  onClick(bookmarkInfo: BookmarkInfo): React.MouseEventHandler
  onDragOver(
    bookmarkInfo: BookmarkInfo,
  ): (evt: React.MouseEvent, responseEvent: ResponseEvent) => void
  onDragStart: React.MouseEventHandler
  onMouseEnter(bookmarkInfo: BookmarkInfo): React.MouseEventHandler
  onMouseLeave(bookmarkInfo: BookmarkInfo): React.MouseEventHandler
  style?: React.CSSProperties
}
export default function BookmarkRowContainer({
  bookmarkInfo,
  isHighlighted,
  onAuxClick,
  onClick,
  onDragOver,
  onMouseEnter,
  onMouseLeave,
  ...restProps
}: Props) {
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

  return (
    <li
      className={restProps.className}
      data-bookmarkid={bookmarkInfo.id}
      style={restProps.style}
    >
      <DragAndDropConsumer
        disableDrag={
          restProps.isDisableDragAndDrop ||
          bookmarkInfo.isRoot ||
          bookmarkInfo.type === CST.BOOKMARK_TYPES.NO_BOOKMARK
        }
        disableDrop={restProps.isDisableDragAndDrop}
        itemKey={bookmarkInfo.id}
        onDragOver={handleDragOver}
        onDragStart={restProps.onDragStart}
      >
        <BookmarkRow
          className={classNames(classes.fullHeight, {
            [classes.rootFolder]: bookmarkInfo.isRoot,
            [classes.dragIndicator]:
              bookmarkInfo.type === CST.BOOKMARK_TYPES.DRAG_INDICATOR,
            [classes.separator]:
              bookmarkInfo.type === CST.BOOKMARK_TYPES.SEPARATOR,
          })}
          iconSize={restProps.iconSize}
          iconUrl={bookmarkInfo.iconUrl}
          isHighlighted={isHighlighted}
          isUnclickable={restProps.isUnclickable}
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
}
