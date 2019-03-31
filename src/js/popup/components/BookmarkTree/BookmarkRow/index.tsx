import classNames from 'classnames'
import * as React from 'react'

import classes from '../../../../../css/popup/bookmark-row.css'
import * as CST from '../../../constants'
import {BookmarkInfo} from '../../../types'
import DragAndDropConsumer, {ResponseEvent} from '../../dragAndDrop/DragAndDropConsumer'
import BookmarkRow from './BookmarkRow'
import useTooltip from './useTooltip'

interface Props {
  bookmarkInfo: BookmarkInfo
  iconSize: number
  isDisableDragAndDrop: boolean
  isHighlighted: boolean
  isSearching: boolean
  isShowTooltip: boolean
  isUnclickable: boolean
  onAuxClick: (bookmarkId: string) => (evt: React.MouseEvent<HTMLElement>) => void
  onClick: (bookmarkId: string) => (evt: React.MouseEvent<HTMLElement>) => void
  onDragOver: (
    bookmarkInfo: BookmarkInfo
  ) => (evt: React.MouseEvent<HTMLElement>, responseEvent: ResponseEvent) => void
  onDragStart: () => void
  onMouseEnter: (bookmarkInfo: BookmarkInfo) => () => void
  onMouseLeave: () => void
}
const BookmarkRowContainer = ({
  bookmarkInfo,
  onAuxClick,
  onClick,
  onDragOver,
  onMouseEnter,
  ...restProps
}: Props) => {
  const tooltip = useTooltip({
    isSearching: restProps.isSearching,
    isShowTooltip: restProps.isShowTooltip,
    bookmarkInfo
  })

  const handleAuxClick = React.useMemo(() => onAuxClick(bookmarkInfo.id), [
    bookmarkInfo.id,
    onAuxClick
  ])
  const handleClick = React.useMemo(() => onClick(bookmarkInfo.id), [bookmarkInfo.id, onClick])
  const handleDragOver = React.useMemo(() => onDragOver(bookmarkInfo), [bookmarkInfo, onDragOver])
  const handleMouseEnter = React.useMemo(() => onMouseEnter(bookmarkInfo), [
    bookmarkInfo,
    onMouseEnter
  ])

  return (
    <DragAndDropConsumer
      className={classes['full-height']}
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
        className={classNames(classes['full-height'], {
          [classes['root-folder']]: bookmarkInfo.isRoot,
          [classes['drag-indicator']]: bookmarkInfo.type === CST.BOOKMARK_TYPES.DRAG_INDICATOR,
          [classes.separator]: bookmarkInfo.type === CST.BOOKMARK_TYPES.SEPARATOR
        })}
        iconSize={restProps.iconSize}
        iconUrl={bookmarkInfo.iconUrl}
        isHighlighted={
          restProps.isHighlighted && bookmarkInfo.type !== CST.BOOKMARK_TYPES.DRAG_INDICATOR
        }
        isUnclickable={restProps.isUnclickable}
        onAuxClick={handleAuxClick}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={restProps.onMouseLeave}
        title={bookmarkInfo.title}
        tooltip={tooltip}
      />
    </DragAndDropConsumer>
  )
}

export default BookmarkRowContainer
