import * as R from 'ramda'
import * as React from 'react'
import {VariableSizeList as List, ListOnScrollProps} from 'react-window'

import classes from '../../../../css/popup/bookmark-tree.css'
import * as CST from '../../constants'
import useEventListener from '../../hooks/useEventListener'
import {BookmarkInfo, BookmarkTree as BookmarkTreeType} from '../../types'
import {ResponseEvent} from '../dragAndDrop/DragAndDropConsumer'
import useDragContainerEvents from '../dragAndDrop/useDragAndDropContainerEvents'
import BookmarkRow from './BookmarkRow'

interface ItemData {
  draggingId: string | null
  highlightedId?: string
  iconSize: number
  isDisableDragAndDrop: boolean
  isSearching: boolean
  isShowTooltip: boolean
  onRowAuxClick: (bookmarkInfo: BookmarkInfo) => React.MouseEventHandler
  onRowClick: (bookmarkInfo: BookmarkInfo) => React.MouseEventHandler
  onRowDragOver: (
    bookmarkInfo: BookmarkInfo
  ) => (evt: React.MouseEvent, responseEvent: ResponseEvent) => void
  onRowDragStart: React.MouseEventHandler
  onRowMouseEnter: (bookmarkInfo: BookmarkInfo) => React.MouseEventHandler
  onRowMouseLeave: (bookmarkInfo: BookmarkInfo) => React.MouseEventHandler
  treeInfo: BookmarkTreeType
}

const getItemKey = (index: number, data: ItemData) => data.treeInfo.children[index].id

const Row = ({data, index, style}: {data: ItemData, index: number, style: React.CSSProperties}) => {
  const bookmarkInfo = data.treeInfo.children[index]
  const isDragging = data.draggingId !== null
  const isBeingDragged = data.draggingId === bookmarkInfo.id
  return (
    <BookmarkRow
      bookmarkInfo={bookmarkInfo}
      className={classes['list-item']}
      iconSize={data.iconSize}
      isDisableDragAndDrop={data.isDisableDragAndDrop}
      isHighlighted={isDragging ? isBeingDragged : data.highlightedId === bookmarkInfo.id}
      isSearching={data.isSearching}
      isShowTooltip={data.isShowTooltip}
      isUnclickable={isBeingDragged}
      onAuxClick={data.onRowAuxClick}
      onClick={data.onRowClick}
      onDragOver={data.onRowDragOver}
      onDragStart={data.onRowDragStart}
      onMouseEnter={data.onRowMouseEnter}
      onMouseLeave={data.onRowMouseLeave}
      style={style}
    />
  )
}

type Props = ItemData & {
  lastScrollTop?: number
  listItemWidth: number
  noRowsRenderer: () => React.ReactElement | null
  onScroll?: (evt: ListOnScrollProps) => void
  rowHeight: number
  scrollToIndex?: number
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

    // @ts-ignore: hacky way to access _outerRef
    const listEl: HTMLElement = listRef.current._outerRef

    const maxListHeight = CST.MAX_HEIGHT - listEl.getBoundingClientRect().top
    const minListHeight = props.rowHeight

    const totalRowHeight = props.treeInfo.children.reduce(
      (acc, x, index) => acc + getRowHeight(index),
      0
    )

    setListHeight(R.clamp(minListHeight, maxListHeight, totalRowHeight))
  }, [getRowHeight, props.rowHeight, props.treeInfo.children])

  React.useEffect(() => {
    if (props.lastScrollTop) {
      if (listRef.current) listRef.current.scrollTo(props.lastScrollTop)
    }
  }, [props.lastScrollTop])

  React.useEffect(() => {
    // hack for unknown bug which scroll to the next item when the list first rendered
    setImmediate(() => {
      if (props.scrollToIndex !== undefined) {
        if (listRef.current) listRef.current.scrollToItem(props.scrollToIndex)
      }
    })
  }, [props.scrollToIndex])

  const itemData = React.useMemo(() => {
    return {
      draggingId: props.draggingId,
      highlightedId: props.highlightedId,
      iconSize: props.iconSize,
      isDisableDragAndDrop: props.isDisableDragAndDrop,
      isSearching: props.isSearching,
      isShowTooltip: props.isShowTooltip,
      onRowAuxClick: props.onRowAuxClick,
      onRowClick: props.onRowClick,
      onRowDragOver: props.onRowDragOver,
      onRowDragStart: props.onRowDragStart,
      onRowMouseEnter: props.onRowMouseEnter,
      onRowMouseLeave: props.onRowMouseLeave,
      treeInfo: props.treeInfo
    }
  }, [
    props.draggingId,
    props.highlightedId,
    props.iconSize,
    props.isDisableDragAndDrop,
    props.isSearching,
    props.isShowTooltip,
    props.onRowAuxClick,
    props.onRowClick,
    props.onRowDragOver,
    props.onRowDragStart,
    props.onRowMouseEnter,
    props.onRowMouseLeave,
    props.treeInfo
  ])

  const outerRef = React.useRef<HTMLDivElement>()
  const {onMouseMove} = useDragContainerEvents()
  useEventListener(outerRef.current, 'mousemove', onMouseMove)

  const itemCount = props.treeInfo.children.length
  if (itemCount === 0) {
    return props.noRowsRenderer()
  }

  return (
    <List
      ref={listRef}
      outerRef={outerRef}
      height={listHeight}
      itemCount={itemCount}
      itemData={itemData}
      itemKey={getItemKey}
      itemSize={getRowHeight}
      onScroll={props.onScroll}
      width={props.listItemWidth}
    >
      {Row}
    </List>
  )
}

export default BookmarkTree
