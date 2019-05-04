import * as React from 'react'

import AbsolutePositionContext, {BodySize} from './AbsolutePositionContext'

const useBodySizeStack = (): {
  globalBodySize?: BodySize
  appendBodySize: (state: BodySize) => void
  removeBodySize: (state: BodySize) => void
} => {
  const {bodySizeStack, setBodySizeStack} = React.useContext(AbsolutePositionContext)

  const appendBodySize = React.useCallback(
    (newBodySize: BodySize) => {
      setBodySizeStack((prevBodySize) => [...prevBodySize, newBodySize])
    },
    [setBodySizeStack]
  )

  const removeBodySize = React.useCallback(
    (oldBodySize: BodySize) => {
      setBodySizeStack((prevBodySize) => {
        return prevBodySize.filter((state) => state !== oldBodySize)
      })
    },
    [setBodySizeStack]
  )

  return {
    globalBodySize: bodySizeStack.reduce(
      (acc, bodySize) => {
        return {
          height: bodySize.height ? Math.max(bodySize.height, acc.height || 0) : acc.height,
          width: bodySize.width ? Math.max(bodySize.width, acc.width || 0) : acc.width
        }
      },
      {
        height: undefined,
        width: undefined
      }
    ),
    appendBodySize,
    removeBodySize
  }
}

export default useBodySizeStack
