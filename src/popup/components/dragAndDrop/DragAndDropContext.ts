import * as React from 'react'

type MouseCoordinate = Readonly<{
  x: number
  y: number
}>

export interface DragAndDropContextType {
  activeKey: string | null
  mouseCoordinate: MouseCoordinate
  pendingKey: string | null
  setActiveKey: (activeKey: string) => void
  setMouseCoordinate: (mouseCoordinate: MouseCoordinate) => void
  setPendingKey: (pendingKey: string) => void
  unsetAllKeys: () => void
}
export default React.createContext<DragAndDropContextType>({
  activeKey: null,
  mouseCoordinate: {
    x: 0,
    y: 0,
  },
  pendingKey: null,
  setActiveKey: () => {},
  setMouseCoordinate: () => {},
  setPendingKey: () => {},
  unsetAllKeys: () => {},
})
