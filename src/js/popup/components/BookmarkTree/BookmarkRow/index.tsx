import classNames from 'classnames'
import * as React from 'react'
import {connect} from 'react-redux'

import classes from '../../../../../css/popup/bookmark-row.css'
import * as CST from '../../../constants'
import {uiCreators} from '../../../reduxs'
import {BookmarkInfo} from '../../../types'
import DragAndDropConsumer, {ResponseEvent} from '../../dragAndDrop/DragAndDropConsumer'
import BookmarkRow from './BookmarkRow'
import useTooltip from './useTooltip'

interface OwnProps {
  bookmarkInfo: BookmarkInfo
  className?: string
  iconSize: number
  isDisableDragAndDrop: boolean
  isHighlighted: boolean
  isSearching: boolean
  isShowTooltip: boolean
  isUnclickable: boolean
  onAuxClick: (bookmarkInfo: BookmarkInfo) => React.MouseEventHandler<HTMLElement>
  onClick: (bookmarkInfo: BookmarkInfo) => React.MouseEventHandler<HTMLElement>
  onDragOver: (
    bookmarkInfo: BookmarkInfo
  ) => (evt: React.MouseEvent<HTMLElement>, responseEvent: ResponseEvent) => void
  onDragStart: React.MouseEventHandler<HTMLElement>
  onMouseEnter: (bookmarkInfo: BookmarkInfo) => React.MouseEventHandler<HTMLElement>
  onMouseLeave: (bookmarkInfo: BookmarkInfo) => React.MouseEventHandler<HTMLElement>
  style?: React.CSSProperties
}

const mapDispatchToProps = {
  setHighlightedItemCoordinates: uiCreators.setHighlightedItemCoordinates
}

type Props = OwnProps & typeof mapDispatchToProps
const BookmarkRowContainer = ({
  bookmarkInfo,
  isHighlighted,
  onAuxClick,
  onClick,
  onDragOver,
  onMouseEnter,
  onMouseLeave,
  setHighlightedItemCoordinates,
  ...restProps
}: Props) => {
  const bookmarkRowRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (isHighlighted && bookmarkRowRef.current) {
      const offset = bookmarkRowRef.current.getBoundingClientRect()
      setHighlightedItemCoordinates({
        positionLeft: offset.left,
        positionTop: offset.top
      })
    }
  }, [isHighlighted, setHighlightedItemCoordinates])

  const tooltip = useTooltip({
    isSearching: restProps.isSearching,
    isShowTooltip: restProps.isShowTooltip,
    bookmarkInfo
  })

  const handleAuxClick = React.useMemo(() => onAuxClick(bookmarkInfo), [bookmarkInfo, onAuxClick])
  const handleClick = React.useMemo(() => onClick(bookmarkInfo), [bookmarkInfo, onClick])
  const handleDragOver = React.useMemo(() => onDragOver(bookmarkInfo), [bookmarkInfo, onDragOver])
  const handleMouseEnter = React.useMemo(() => onMouseEnter(bookmarkInfo), [
    bookmarkInfo,
    onMouseEnter
  ])
  const handleMouseLeave = React.useMemo(() => onMouseLeave(bookmarkInfo), [
    bookmarkInfo,
    onMouseLeave
  ])

  return (
    <DragAndDropConsumer
      className={restProps.className}
      disableDrag={
        restProps.isDisableDragAndDrop ||
        bookmarkInfo.isRoot ||
        bookmarkInfo.type === CST.BOOKMARK_TYPES.NO_BOOKMARK
      }
      disableDrop={restProps.isDisableDragAndDrop}
      itemKey={bookmarkInfo.id}
      onDragOver={handleDragOver}
      onDragStart={restProps.onDragStart}
      style={restProps.style}
    >
      <BookmarkRow
        ref={bookmarkRowRef}
        className={classNames(classes['full-height'], {
          [classes['root-folder']]: bookmarkInfo.isRoot,
          [classes['drag-indicator']]: bookmarkInfo.type === CST.BOOKMARK_TYPES.DRAG_INDICATOR,
          [classes.separator]: bookmarkInfo.type === CST.BOOKMARK_TYPES.SEPARATOR
        })}
        iconSize={restProps.iconSize}
        iconUrl={bookmarkInfo.iconUrl}
        isHighlighted={isHighlighted}
        isUnclickable={restProps.isUnclickable}
        onAuxClick={handleAuxClick}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title={bookmarkInfo.title}
        tooltip={tooltip}
      />
    </DragAndDropConsumer>
  )
}

export default connect(
  null,
  mapDispatchToProps
)(BookmarkRowContainer)
