import * as React from 'react'

import DragAndDropContext from './DragAndDropContext'

export interface ResponseEvent {
  activeKey: string | null
  itemKey: string
}

const useDragEvents = ({
  itemKey,
  onDragOver,
  onDragStart
}: {
  itemKey: string
  onDragOver: (evt: React.MouseEvent<HTMLElement>, responseEvent: ResponseEvent) => void
  onDragStart: (evt: React.MouseEvent<HTMLElement>, responseEvent: ResponseEvent) => void
}) => {
  const {activeKey, setActiveKey, setPendingKey, unsetAllKeys} = React.useContext(
    DragAndDropContext
  )

  return {
    handleDragOver: React.useCallback(
      (evt: React.MouseEvent<HTMLElement>) => {
        onDragOver(evt, {
          activeKey,
          itemKey
        })
      },
      [activeKey, itemKey, onDragOver]
    ),
    handleDragStart: React.useCallback(
      (evt: React.MouseEvent<HTMLElement>) => {
        setActiveKey(itemKey)
        onDragStart(evt, {
          activeKey,
          itemKey
        })
      },
      [activeKey, itemKey, onDragStart, setActiveKey]
    ),
    handleMouseDown: React.useCallback(
      (evt: React.MouseEvent<HTMLElement>) => {
        if (evt.buttons !== 1) return

        setPendingKey(itemKey)
      },
      [itemKey, setPendingKey]
    ),
    handleMouseUp: React.useCallback(() => {
      unsetAllKeys()
    }, [unsetAllKeys])
  }
}

const useMouseEvents = () => {
  const [shouldDisableNextClick, setShouldDisableNextClick] = React.useState(false)

  return {
    handleClickCapture: React.useCallback(
      (evt: React.MouseEvent<HTMLElement>) => {
        if (shouldDisableNextClick) {
          evt.stopPropagation()
          setShouldDisableNextClick(false)
        }
      },
      [shouldDisableNextClick]
    ),
    handleMouseUpCapture: React.useCallback(() => {
      setShouldDisableNextClick(true)
    }, [])
  }
}

interface Props {
  children: React.ReactNode
  className?: string
  disableDrag?: boolean
  disableDrop?: boolean
  itemKey: string
  onDragOver: (evt: React.MouseEvent<HTMLElement>, responseEvent: ResponseEvent) => void
  onDragStart: (evt: React.MouseEvent<HTMLElement>, responseEvent: ResponseEvent) => void
  style?: React.CSSProperties
}
const DragAndDropConsumer = (props: Props) => {
  const context = React.useContext(DragAndDropContext)

  const {handleClickCapture, handleMouseUpCapture} = useMouseEvents()

  const {handleDragStart, handleDragOver, handleMouseDown, handleMouseUp} = useDragEvents({
    itemKey: props.itemKey,
    onDragOver: props.onDragOver,
    onDragStart: props.onDragStart
  })

  const isDragging = context.activeKey !== null
  const isPending = context.pendingKey === props.itemKey
  return (
    <div
      className={props.className}
      style={props.style}
      onClickCapture={handleClickCapture}
      onMouseUpCapture={isDragging ? handleMouseUpCapture : undefined}
      {...(props.disableDrag !== true ?
        {
          onMouseDown: isDragging ? undefined : handleMouseDown,
          onMouseUp: isPending ? handleMouseUp : undefined,
          onMouseMove: isPending ? handleDragStart : undefined
        } :
        {})}
      {...(props.disableDrop !== true ?
        {
          onMouseOver: isDragging ? handleDragOver : undefined
        } :
        {})}
    >
      {props.children}
    </div>
  )
}

export default DragAndDropConsumer
