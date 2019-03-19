import classNames from 'classnames'
import * as R from 'ramda'
import * as React from 'react'
import styled from 'styled-components'

import classes from '../../../../css/popup/bookmark-row.css'
import * as CST from '../../constants'
import {BookmarkInfo} from '../../types'
import DragAndDropConsumer, {ResponseEvent} from '../dragAndDrop/DragAndDropConsumer'

interface IconImgProps {
  iconSize: number
}
const IconImg = styled('img')<IconImgProps>`
  width: ${R.prop('iconSize')}px;
`

interface Props {
  bookmarkInfo: BookmarkInfo
  iconSize: number
  isDisableDragAndDrop: boolean
  isHighlighted: boolean
  isUnclickable: boolean
  onAuxClick: (bookmarkId: string) => (evt: MouseEvent) => void
  onClick: (bookmarkId: string) => (evt: React.MouseEvent<HTMLElement>) => void
  onDragOver: (
    bookmarkInfo: BookmarkInfo
  ) => (evt: React.MouseEvent<HTMLElement>, responseEvent: ResponseEvent) => void
  onDragStart: () => void
  onMouseEnter: (bookmarkInfo: BookmarkInfo) => () => void
  onMouseLeave: () => void
}
const BookmarkRow = ({
  bookmarkInfo,
  onAuxClick,
  onClick,
  onDragOver,
  onMouseEnter,
  ...restProps
}: Props) => {
  const baseRef = React.useRef(null)

  React.useEffect(() => {
    const baseEl = baseRef.current
    if (!baseEl) return undefined

    const handleAuxClick = onAuxClick(bookmarkInfo.id)

    // @ts-ignore: https://github.com/Microsoft/TypeScript/issues/29995
    baseEl.addEventListener('auxclick', handleAuxClick)

    return () => {
      // @ts-ignore: https://github.com/Microsoft/TypeScript/issues/29995
      baseEl.removeEventListener('auxclick', handleAuxClick)
    }
  }, [bookmarkInfo.id, onAuxClick])

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
      <div
        ref={baseRef}
        className={classNames(classes.main, classes['full-height'], {
          [classes.highlighted]:
            restProps.isHighlighted && bookmarkInfo.type !== CST.BOOKMARK_TYPES.DRAG_INDICATOR,
          [classes['root-folder']]: bookmarkInfo.isRoot,
          [classes['drag-indicator']]: bookmarkInfo.type === CST.BOOKMARK_TYPES.DRAG_INDICATOR,
          [classes.separator]: bookmarkInfo.type === CST.BOOKMARK_TYPES.SEPARATOR,
          [classes.unclickable]: restProps.isUnclickable
        })}
        onClick={restProps.isUnclickable ? undefined : handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={restProps.onMouseLeave}
      >
        {bookmarkInfo.iconUrl && (
          <IconImg
            iconSize={restProps.iconSize}
            className={classes.icon}
            src={bookmarkInfo.iconUrl}
            alt=''
          />
        )}
        <div className={classes.title}>{bookmarkInfo.title}</div>
      </div>
    </DragAndDropConsumer>
  )
}

export default BookmarkRow
