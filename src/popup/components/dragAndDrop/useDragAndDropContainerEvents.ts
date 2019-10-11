import * as React from 'react'

import DragAndDropContext from './DragAndDropContext'

const useDragAndDropContainerEvents = ({
  margin = 20,
}: { margin?: number } = {}) => {
  const { activeKey } = React.useContext(DragAndDropContext)
  const isDragging = activeKey !== null

  const scrollingTimeoutRef = React.useRef<NodeJS.Timeout>()

  const clearScroll = React.useCallback(() => {
    if (scrollingTimeoutRef.current !== undefined) {
      clearInterval(scrollingTimeoutRef.current)
      scrollingTimeoutRef.current = undefined
    }
  }, [])

  React.useEffect(() => {
    if (!isDragging) {
      clearScroll()
    }
  }, [clearScroll, isDragging])

  return React.useMemo(() => {
    const scroll = (
      containerElement: HTMLElement,
      { isUpward }: { isUpward: boolean },
    ) => {
      clearScroll()

      scrollingTimeoutRef.current = setInterval(() => {
        containerElement.scrollTo({
          top: containerElement.scrollTop + (isUpward ? -1 : 1) * 20,
        })
      }, 50)
    }

    const onMouseMove = (evt: MouseEvent | React.MouseEvent) => {
      if (!isDragging) return

      if (evt.currentTarget instanceof HTMLElement) {
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
      }
    }

    return {
      onMouseMove,
    }
  }, [clearScroll, isDragging, margin])
}

export default useDragAndDropContainerEvents
