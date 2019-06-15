import * as React from 'react'

export interface BodySize {
  height?: number
  width?: number
}
type BodySizeStack = ReadonlyArray<BodySize>

export interface AbsolutePositionContextType {
  bodySizeStack: BodySizeStack
  setBodySizeStack: React.Dispatch<React.SetStateAction<BodySizeStack>>
}
export default React.createContext<AbsolutePositionContextType>({
  bodySizeStack: [],
  setBodySizeStack: () => {}
})
