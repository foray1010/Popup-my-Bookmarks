import { useCallback, useMemo } from 'react'

import { notNullish } from '@/core/utils/array.js'

import {
  type BodySize,
  useFloatingWindowContext,
} from './FloatingWindowContext.js'

export default function useGlobalBodySize() {
  const { bodySizeStack, setBodySizeStack } = useFloatingWindowContext()

  const globalBodySize = useMemo(() => {
    const heights = bodySizeStack.map((x) => x.height).filter(notNullish)
    const maxHeight = heights.length > 0 ? Math.max(...heights) : undefined

    const widths = bodySizeStack.map((x) => x.width).filter(notNullish)
    const maxWidth = widths.length > 0 ? Math.max(...widths) : undefined

    return {
      height: maxHeight,
      width: maxWidth,
    }
  }, [bodySizeStack])

  const insertBodySize = useCallback(
    (newBodySize: BodySize) => {
      setBodySizeStack((prevBodySize) => [...prevBodySize, newBodySize])

      return {
        removeBodySize: () => {
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
