import {
  type DragEvent,
  type DragEventHandler,
  type MouseEvent,
  type MouseEventHandler,
  type PropsWithChildren,
  useCallback,
  useState,
} from 'react'

import { useDragAndDropContext } from './DragAndDropContext.js'
import type { ResponseEvent } from './types.js'

type Props = Readonly<
  PropsWithChildren<{
    disableDrag?: boolean
    disableDrop?: boolean
    itemKey: string
    onDragOver: (
      evt: Readonly<MouseEvent>,
      responseEvent: ResponseEvent,
    ) => void
    onDragStart: (
      evt: Readonly<DragEvent>,
      responseEvent: ResponseEvent,
    ) => void
  }>
>

function useDragEvents({ itemKey, onDragOver, onDragStart }: Props) {
  const { activeKey, setActiveKey } = useDragAndDropContext()

  return {
    handleDragOver: useCallback<MouseEventHandler>(
      (evt) => {
        if (activeKey === null) return

        onDragOver(evt, {
          activeKey,
          itemKey,
        })
      },
      [activeKey, itemKey, onDragOver],
    ),
    handleDragStart: useCallback<DragEventHandler>(
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

function useMouseEvents() {
  const { activeKey } = useDragAndDropContext()

  const isDragging = activeKey !== null

  const [shouldDisableNextClick, setShouldDisableNextClick] = useState(false)

  return {
    // avoid the user to open the bookmark after dragging is started and user drops on the original bookmark
    // have to use with mouseupcapture event because the mouseup event is fired before `activeKey` is reset to null
    handleClickCapture: useCallback<MouseEventHandler>(
      (evt) => {
        if (shouldDisableNextClick) {
          evt.stopPropagation()
          setShouldDisableNextClick(false)
        }
      },
      [shouldDisableNextClick],
    ),
    handleMouseUpCapture: useCallback<MouseEventHandler>(() => {
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
      role='presentation'
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
