import constate from 'constate'
import * as React from 'react'
import useEventListener from 'use-typed-event-listener'

const useDragAndDropState = () => {
  const [activeKey, setActiveKey] = React.useState<string | null>(null)

  return React.useMemo(
    () => ({
      activeKey,
      setActiveKey,
    }),
    [activeKey],
  )
}

const useDragAndDrop = ({
  onDragEnd,
  onDrop,
}: {
  readonly onDragEnd: (evt: MouseEvent) => void
  readonly onDrop: (evt: MouseEvent, activeKey: string) => void
}) => {
  const state = useDragAndDropState()

  const { activeKey, setActiveKey } = state

  // use window.mouseup to handle drop events because we are not using native drag, and it can support drop outside of the document.body
  useEventListener(window, 'mouseup', (evt) => {
    // ignore as user is not dragging
    if (activeKey === null) return

    if (evt.buttons === 0) {
      onDrop(evt, activeKey)
      onDragEnd(evt)

      setActiveKey(null)
    }
  })

  return state
}

export const [DragAndDropProvider, useDragAndDropContext] =
  constate(useDragAndDrop)
