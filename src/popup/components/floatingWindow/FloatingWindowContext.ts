import constate from 'constate'
import * as React from 'react'

export interface BodySize {
  readonly height: number | undefined
  readonly width: number | undefined
}
type BodySizeStack = ReadonlyArray<BodySize>

const useFloatingWindow = () => {
  const [bodySizeStack, setBodySizeStack] = React.useState<BodySizeStack>([])

  return {
    bodySizeStack,
    setBodySizeStack,
  }
}

export const [FloatingWindowProvider, useFloatingWindowContext] =
  constate(useFloatingWindow)
