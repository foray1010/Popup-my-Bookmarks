import constate from 'constate'
import * as React from 'react'

export type BodySize = Readonly<{
  height: number | undefined
  width: number | undefined
}>
type BodySizeStack = ReadonlyArray<BodySize>

function useFloatingWindow() {
  const [bodySizeStack, setBodySizeStack] = React.useState<BodySizeStack>([])

  return {
    bodySizeStack,
    setBodySizeStack,
  }
}

export const [FloatingWindowProvider, useFloatingWindowContext] =
  constate(useFloatingWindow)
