import * as R from 'ramda'
import * as React from 'react'
import {VariableSizeList as List} from 'react-window'

import classes from '../../../../css/popup/bookmark-tree.css'
import * as CST from '../../constants'
import {BookmarkInfo, BookmarkTree as BookmarkTreeType} from '../../types'
import {ResponseEvent} from '../dragAndDrop/DragAndDropConsumer'
import BookmarkRow from './BookmarkRow'

interface Props {
  draggingId: string | null
  highlightedId: string
  iconSize: number
  isDisableDragAndDrop: boolean
  listItemWidth: number
  noRowsRenderer: () => React.ReactElement | null
  onRowAuxClick: (bookmarkId: string) => (evt: MouseEvent) => void
  onRowClick: (bookmarkId: string) => (evt: React.MouseEvent<HTMLElement>) => void
  onRowDragOver: (
    bookmarkInfo: BookmarkInfo
  ) => (evt: React.MouseEvent<HTMLElement>, responseEvent: ResponseEvent) => void
  onRowDragStart: () => void
  onRowMouseEnter: (bookmarkInfo: BookmarkInfo) => () => void
  onRowMouseLeave: () => void
  rowHeight: number
  scrollToIndex: number
  treeInfo: BookmarkTreeType
}
const BookmarkTree = (props: Props) => {
  const listRef = React.useRef<List>(null)

  const [listHeight, setListHeight] = React.useState(0)

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
    [props.rowHeight, props.treeInfo.children]
  )

  React.useEffect(() => {
    if (!listRef.current) return

    // force recalculate all row heights as it doesn't recalculate
    listRef.current.resetAfterIndex(0, true)

    const maxListHeight =
      // @ts-ignore: hacky way to access _outerRef
      CST.MAX_HEIGHT - listRef.current._outerRef.getBoundingClientRect().top
    const minListHeight = props.rowHeight

    const totalRowHeight = props.treeInfo.children.reduce(
      (acc, x, index) => acc + getRowHeight(index),
      0
    )

    setListHeight(R.clamp(minListHeight, maxListHeight, totalRowHeight))
  }, [getRowHeight, props.rowHeight, props.treeInfo.children])

  React.useEffect(() => {
    if (props.scrollToIndex >= 0) {
      if (listRef.current) listRef.current.scrollToItem(props.scrollToIndex)
    }
  }, [props.scrollToIndex])

  const rowRenderer = React.useCallback(
    ({index, style}: {index: number, style: React.CSSProperties}) => {
      const bookmarkInfo = props.treeInfo.children[index]
      const isBeingDragged = props.draggingId === bookmarkInfo.id
      return (
        <div key={bookmarkInfo.id} className={classes['list-item']} style={style}>
          <BookmarkRow
            bookmarkInfo={bookmarkInfo}
            iconSize={props.iconSize}
            isDisableDragAndDrop={props.isDisableDragAndDrop}
            isHighlighted={props.highlightedId === bookmarkInfo.id || isBeingDragged}
            isUnclickable={isBeingDragged}
            onAuxClick={props.onRowAuxClick}
            onClick={props.onRowClick}
            onDragOver={props.onRowDragOver}
            onDragStart={props.onRowDragStart}
            onMouseEnter={props.onRowMouseEnter}
            onMouseLeave={props.onRowMouseLeave}
          />
        </div>
      )
    },
    [
      props.draggingId,
      props.highlightedId,
      props.iconSize,
      props.isDisableDragAndDrop,
      props.onRowAuxClick,
      props.onRowClick,
      props.onRowDragOver,
      props.onRowDragStart,
      props.onRowMouseEnter,
      props.onRowMouseLeave,
      props.treeInfo.children
    ]
  )

  const itemCount = props.treeInfo.children.length

  if (itemCount === 0) {
    return props.noRowsRenderer()
  }

  return (
    <List
      ref={listRef}
      height={listHeight}
      itemCount={itemCount}
      itemSize={getRowHeight}
      width={props.listItemWidth}
    >
      {rowRenderer}
    </List>
  )
}

export default BookmarkTree
