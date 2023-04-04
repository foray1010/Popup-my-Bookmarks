import * as React from 'react'

import { useDragAndDropContext } from './DragAndDropContext.js'
import type { ResponseEvent } from './types.js'

type Props = React.PropsWithChildren<{
  readonly disableDrag?: boolean
  readonly disableDrop?: boolean
  readonly itemKey: string
  readonly onDragOver: (
    evt: React.MouseEvent,
    responseEvent: ResponseEvent,
  ) => void
  readonly onDragStart: (
    evt: React.DragEvent,
    responseEvent: ResponseEvent,
  ) => void
}>

const useDragEvents = ({ itemKey, onDragOver, onDragStart }: Props) => {
  const { activeKey, setActiveKey } = useDragAndDropContext()

  return {
    handleDragOver: React.useCallback<React.MouseEventHandler>(
      (evt) => {
        if (activeKey === null) return

        onDragOver(evt, {
          activeKey,
          itemKey,
        })
      },
      [activeKey, itemKey, onDragOver],
    ),
    handleDragStart: React.useCallback<React.DragEventHandler>(
      (evt) => {
        // not using native drag because it does not work when the element is removed from the DOM
        evt.preventDefault()

        setActiveKey(itemKey)

        onDragStart(evt, {
          activeKey: itemKey,
          itemKey,
        })
      },
      [itemKey, onDragStart, setActiveKey],
    ),
  }
}

const useMouseEvents = () => {
  const { activeKey } = useDragAndDropContext()

  const isDragging = activeKey !== null

  const [shouldDisableNextClick, setShouldDisableNextClick] =
    React.useState(false)

  return {
    // avoid the user to open the bookmark after dragging is started and user drops on the original bookmark
    // have to use with mouseupcapture event because the mouseup event is fired before `activeKey` is reset to null
    handleClickCapture: React.useCallback<React.MouseEventHandler>(
      (evt) => {
        if (shouldDisableNextClick) {
          evt.stopPropagation()
          setShouldDisableNextClick(false)
        }
      },
      [shouldDisableNextClick],
    ),
    handleMouseUpCapture: React.useCallback<React.MouseEventHandler>(() => {
      if (isDragging) {
        setShouldDisableNextClick(true)
      }
    }, [isDragging]),
  }
}

export default function DragAndDropConsumer(props: Props) {
  const { handleClickCapture, handleMouseUpCapture } = useMouseEvents()

  const { handleDragStart, handleDragOver } = useDragEvents(props)

  return (
    <div
      onClickCapture={handleClickCapture}
      onMouseUpCapture={handleMouseUpCapture}
      {...(props.disableDrag !== true && {
        draggable: true,
        onDragStart: handleDragStart,
      })}
      {...(props.disableDrop !== true && {
        onMouseOver: handleDragOver,
      })}
    >
      {props.children}
    </div>
  )
}
