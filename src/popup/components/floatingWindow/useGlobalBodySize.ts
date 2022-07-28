import * as React from 'react'

import type { BodySize } from './FloatingWindowContext'
import { useFloatingWindowContext } from './FloatingWindowContext'

export default function useGlobalBodySize(): {
  globalBodySize?: BodySize
  insertBodySize(state: BodySize): {
    removeBodySize(): void
  }
} {
  const { bodySizeStack, setBodySizeStack } = useFloatingWindowContext()

  const globalBodySize = React.useMemo(() => {
    const notUndefined = <T>(x?: T): x is T => x !== undefined

    const heights = bodySizeStack.map((x) => x.height).filter(notUndefined)
    const maxHeight = heights.length > 0 ? Math.max(...heights) : undefined

    const widths = bodySizeStack.map((x) => x.width).filter(notUndefined)
    const maxWidth = widths.length > 0 ? Math.max(...widths) : undefined

    return {
      height: maxHeight,
      width: maxWidth,
    }
  }, [bodySizeStack])

  const insertBodySize = React.useCallback(
    (newBodySize: BodySize) => {
      setBodySizeStack((prevBodySize) => [...prevBodySize, newBodySize])

      return {
        removeBodySize() {
          setBodySizeStack((prevBodySize) => {
            return prevBodySize.filter((state) => state !== newBodySize)
          })
        },
      }
    },
    [setBodySizeStack],
  )

  return {
    globalBodySize,
    insertBodySize,
  }
}
