import { type MouseEventHandler, useCallback, useEffect, useRef } from 'react'

import { useDragAndDropContext } from './DragAndDropContext.js'

function useScroll() {
  const scrollingTimeoutRef = useRef<ReturnType<typeof setInterval>>()

  const clearScroll = useCallback(() => {
    if (scrollingTimeoutRef.current !== undefined) {
      clearInterval(scrollingTimeoutRef.current)
      scrollingTimeoutRef.current = undefined
    }
  }, [])

  const scroll = useCallback(
    (
      containerElement: Readonly<HTMLElement>,
      { isUpward }: Readonly<{ isUpward: boolean }>,
    ) => {
      clearScroll()

      scrollingTimeoutRef.current = setInterval(() => {
        containerElement.scrollTo({
          top: containerElement.scrollTop + (isUpward ? -1 : 1) * 20,
        })
      }, 50)
    },
    [clearScroll],
  )

  return { clearScroll, scroll }
}

export default function useDragZoneEvents({
  margin = 20,
}: Readonly<{
  margin?: number
}> = {}) {
  const { activeKey } = useDragAndDropContext()
  const isDragging = activeKey !== null

  const { clearScroll, scroll } = useScroll()

  useEffect(() => {
    if (!isDragging) {
      clearScroll()
    }
  }, [clearScroll, isDragging])

  const onMouseMove = useCallback<MouseEventHandler>(
    (evt) => {
      if (!(evt.currentTarget instanceof HTMLElement)) return

      if (!isDragging) return

      const rect = evt.currentTarget.getBoundingClientRect()

      const displacementTop = Math.abs(rect.top - evt.clientY)
      const displacementBottom = Math.abs(rect.bottom - evt.clientY)

      if (displacementTop <= margin) {
        scroll(evt.currentTarget, {
          isUpward: true,
        })
      } else if (displacementBottom <= margin) {
        scroll(evt.currentTarget, {
          isUpward: false,
        })
      } else {
        clearScroll()
      }
    },
    [clearScroll, isDragging, margin, scroll],
  )

  return {
    /** when the mouse is on top/bottom of the drag zone, scroll the zone */
    onMouseMove,
  }
}
