import * as React from 'react'

export interface ContextType {
  activeKey: string | null
  pendingKey: string | null
  setActiveKey: (activeKey: string) => void
  setPendingKey: (pendingKey: string) => void
}
export default React.createContext<ContextType>({
  activeKey: null,
  pendingKey: null,
  setActiveKey: () => {},
  setPendingKey: () => {}
})
