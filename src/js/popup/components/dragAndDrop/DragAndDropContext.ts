import * as React from 'react'

export interface DragAndDropContextType {
  activeKey: string | null
  pendingKey: string | null
  setActiveKey: (activeKey: string) => void
  setPendingKey: (pendingKey: string) => void
  unsetAllKeys: () => void
}
export default React.createContext<DragAndDropContextType>({
  activeKey: null,
  pendingKey: null,
  setActiveKey: () => {},
  setPendingKey: () => {},
  unsetAllKeys: () => {}
})
