import constate from 'constate'
import * as React from 'react'
import useEventListener from 'use-typed-event-listener'

type MouseCoordinate = Readonly<{
  x: number
  y: number
}>

const useDragAndDropState = () => {
  const [activeKey, setActiveKeyState] = React.useState<string | null>(null)
  const [mouseCoordinate, setMouseCoordinate] = React.useState<MouseCoordinate>(
    {
      x: 0,
      y: 0,
    },
  )
  const [pendingKey, setPendingKeyState] = React.useState<string | null>(null)

  const setActiveKey = React.useCallback((key: string) => {
    setActiveKeyState(key)
    setPendingKeyState(null)
  }, [])
  const setPendingKey = React.useCallback((key: string) => {
    setPendingKeyState(key)
    setActiveKeyState(null)
  }, [])
  const unsetAllKeys = React.useCallback(() => {
    setPendingKeyState(null)
    setActiveKeyState(null)
  }, [])

  return React.useMemo(
    () => ({
      activeKey,
      mouseCoordinate,
      pendingKey,
      setActiveKey,
      setMouseCoordinate,
      setPendingKey,
      unsetAllKeys,
    }),
    [
      activeKey,
      mouseCoordinate,
      pendingKey,
      setActiveKey,
      setPendingKey,
      unsetAllKeys,
    ],
  )
}

const useDragAndDrop = ({
  onDragEnd,
  onDrop,
}: {
  onDragEnd: (evt: MouseEvent) => void
  onDrop: (evt: MouseEvent, activeKey: string) => void
}) => {
  const state = useDragAndDropState()

  const { activeKey, unsetAllKeys } = state

  const isDragging = activeKey !== null

  const handleDrop = (evt: MouseEvent) => {
    if (!isDragging) return

    if (evt.buttons !== 1) {
      unsetAllKeys()
      if (activeKey !== null) onDrop(evt, activeKey)
      onDragEnd(evt)
    }
  }
  useEventListener(document.body, 'mouseenter', handleDrop)
  useEventListener(window, 'mouseup', handleDrop)

  return state
}

export const [DragAndDropProvider, useDragAndDropContext] = constate(
  useDragAndDrop,
)
