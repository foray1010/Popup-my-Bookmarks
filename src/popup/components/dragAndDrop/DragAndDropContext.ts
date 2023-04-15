import constate from 'constate'
import * as React from 'react'
import useEventListener from 'use-typed-event-listener'

function useDragAndDrop({
  onDragEnd,
  onDrop,
}: Readonly<{
  onDragEnd: (evt: Readonly<MouseEvent>) => void
  onDrop: (evt: Readonly<MouseEvent>, activeKey: string) => void
}>) {
  const [activeKey, setActiveKey] = React.useState<string | null>(null)

  // use document.mouseup to handle drop events because we are not using native drag, and it can support drop outside of the document.body
  useEventListener(document, 'mouseup', (evt) => {
    // ignore as user is not dragging
    if (activeKey === null) return

    if (evt.buttons === 0) {
      onDrop(evt, activeKey)
      onDragEnd(evt)

      setActiveKey(null)
    }
  })

  return {
    activeKey,
    setActiveKey,
  }
}

export const [DragAndDropProvider, useDragAndDropContext] =
  constate(useDragAndDrop)
