import constate from 'constate'
import * as React from 'react'

export interface BodySize {
  height?: number
  width?: number
}
type BodySizeStack = ReadonlyArray<BodySize>

const useAbsolutePosition = () => {
  const [bodySizeStack, setBodySizeStack] = React.useState<BodySizeStack>([])

  return React.useMemo(
    () => ({
      bodySizeStack,
      setBodySizeStack,
    }),
    [bodySizeStack, setBodySizeStack],
  )
}

export const [AbsolutePositionProvider, useAbsolutePositionContext] = constate(
  useAbsolutePosition,
)
