import * as React from 'react'

import { useDragAndDropContext } from './DragAndDropContext'

const useScroll = () => {
  const scrollingTimeoutRef = React.useRef<number>()

  const clearScroll = React.useCallback(() => {
    if (scrollingTimeoutRef.current !== undefined) {
      clearInterval(scrollingTimeoutRef.current)
      scrollingTimeoutRef.current = undefined
    }
  }, [])

  const scroll = React.useCallback(
    (containerElement: Element, { isUpward }: { isUpward: boolean }) => {
      clearScroll()

      scrollingTimeoutRef.current = window.setInterval(() => {
        containerElement.scrollTo({
          top: containerElement.scrollTop + (isUpward ? -1 : 1) * 20,
        })
      }, 50)
    },
    [clearScroll],
  )

  return { clearScroll, scroll }
}

export default function useDragAndDropContainerEvents({
  margin = 20,
}: {
  readonly margin?: number
} = {}) {
  const { activeKey } = useDragAndDropContext()
  const isDragging = activeKey !== null

  const { clearScroll, scroll } = useScroll()

  React.useEffect(() => {
    if (!isDragging) {
      clearScroll()
    }
  }, [clearScroll, isDragging])

  const onMouseMove = React.useCallback(
    (evt: MouseEvent | React.MouseEvent) => {
      if (!(evt.currentTarget instanceof Element)) return

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

  return { onMouseMove }
}
