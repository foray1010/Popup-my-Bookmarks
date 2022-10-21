import * as React from 'react'

import StylelessElement from '../../../core/components/baseItems/StylelessElement/index.js'
import { useDragAndDropContext } from './DragAndDropContext.js'
import type { ResponseEvent } from './types.js'

const useDragEvents = ({
  itemKey,
  onDragOver,
  onDragStart,
}: {
  readonly itemKey: string
  readonly onDragOver: (
    evt: React.MouseEvent,
    responseEvent: ResponseEvent,
  ) => void
  readonly onDragStart: (
    evt: React.MouseEvent,
    responseEvent: ResponseEvent,
  ) => void
}) => {
  const {
    activeKey,
    mouseCoordinate,
    pendingKey,
    setActiveKey,
    setMouseCoordinate,
    setPendingKey,
    unsetAllKeys,
  } = useDragAndDropContext()

  return {
    handleDragOver: React.useCallback(
      (evt: React.MouseEvent) => {
        onDragOver(evt, {
          activeKey,
          itemKey,
        })
      },
      [activeKey, itemKey, onDragOver],
    ),
    handleDragStart: React.useCallback(
      (evt: React.MouseEvent) => {
        if (pendingKey === null) return

        const threshold = 5
        const xDisplacement = Math.abs(mouseCoordinate.x - evt.clientX)
        const yDisplacement = Math.abs(mouseCoordinate.y - evt.clientY)
        // prevent triggering drag instead of click due to hand shaking
        if (xDisplacement <= threshold && yDisplacement <= threshold) return

        setActiveKey(pendingKey)

        onDragStart(evt, {
          activeKey: pendingKey,
          itemKey,
        })
      },
      [
        itemKey,
        mouseCoordinate.x,
        mouseCoordinate.y,
        onDragStart,
        pendingKey,
        setActiveKey,
      ],
    ),
    handleMouseDown: React.useCallback(
      (evt: React.MouseEvent) => {
        if (evt.buttons !== 1) return

        setPendingKey(itemKey)

        setMouseCoordinate({
          x: evt.clientX,
          y: evt.clientY,
        })
      },
      [itemKey, setMouseCoordinate, setPendingKey],
    ),
    handleMouseUp: React.useCallback(() => {
      unsetAllKeys()
    }, [unsetAllKeys]),
  }
}

const useMouseEvents = () => {
  const [shouldDisableNextClick, setShouldDisableNextClick] =
    React.useState(false)

  return {
    handleClickCapture: React.useCallback(
      (evt: React.MouseEvent) => {
        if (shouldDisableNextClick) {
          evt.stopPropagation()
          setShouldDisableNextClick(false)
        }
      },
      [shouldDisableNextClick],
    ),
    handleMouseUpCapture: React.useCallback(() => {
      setShouldDisableNextClick(true)
    }, []),
  }
}

interface Props {
  readonly children: React.ReactNode
  readonly disableDrag?: boolean
  readonly disableDrop?: boolean
  readonly itemKey: string
  readonly onDragOver: (
    evt: React.MouseEvent,
    responseEvent: ResponseEvent,
  ) => void
  readonly onDragStart: (
    evt: React.MouseEvent,
    responseEvent: ResponseEvent,
  ) => void
}
export default function DragAndDropConsumer(props: Props) {
  const context = useDragAndDropContext()

  const { handleClickCapture, handleMouseUpCapture } = useMouseEvents()

  const { handleDragStart, handleDragOver, handleMouseDown, handleMouseUp } =
    useDragEvents({
      itemKey: props.itemKey,
      onDragOver: props.onDragOver,
      onDragStart: props.onDragStart,
    })

  const isDragging = context.activeKey !== null
  const isPending = context.pendingKey !== null
  return (
    <StylelessElement
      onClickCapture={handleClickCapture}
      onMouseUpCapture={isDragging ? handleMouseUpCapture : undefined}
      {...(props.disableDrag !== true
        ? {
            onMouseDown: isDragging ? undefined : handleMouseDown,
            onMouseUp: isPending ? handleMouseUp : undefined,
            onMouseMove: isPending ? handleDragStart : undefined,
          }
        : {})}
      {...(props.disableDrop !== true
        ? {
            onMouseOver: isDragging ? handleDragOver : undefined,
          }
        : {})}
    >
      {props.children}
    </StylelessElement>
  )
}
