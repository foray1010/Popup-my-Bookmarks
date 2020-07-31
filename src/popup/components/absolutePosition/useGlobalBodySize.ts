import * as React from 'react'

import { BodySize, useAbsolutePositionContext } from './AbsolutePositionContext'

const useBodySizeStack = (): {
  globalBodySize?: BodySize
  appendBodySize: (state: BodySize) => void
  removeBodySize: (state: BodySize) => void
} => {
  const { bodySizeStack, setBodySizeStack } = useAbsolutePositionContext()

  const globalBodySize = React.useMemo(() => {
    return bodySizeStack.reduce(
      (acc, bodySize) => {
        return {
          height: bodySize.height
            ? Math.max(bodySize.height, acc.height ?? 0)
            : acc.height,
          width: bodySize.width
            ? Math.max(bodySize.width, acc.width ?? 0)
            : acc.width,
        }
      },
      {
        height: undefined,
        width: undefined,
      },
    )
  }, [bodySizeStack])

  const appendBodySize = React.useCallback(
    (newBodySize: BodySize) => {
      setBodySizeStack((prevBodySize) => [...prevBodySize, newBodySize])
    },
    [setBodySizeStack],
  )

  const removeBodySize = React.useCallback(
    (oldBodySize: BodySize) => {
      setBodySizeStack((prevBodySize) => {
        return prevBodySize.filter((state) => state !== oldBodySize)
      })
    },
    [setBodySizeStack],
  )

  return {
    globalBodySize,
    appendBodySize,
    removeBodySize,
  }
}

export default useBodySizeStack
