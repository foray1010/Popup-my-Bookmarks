// @flow strict

import {createContext} from 'react'

export type ContextType = {|
  activeKey: string | null,
  pendingKey: string | null,
  setActiveKey: (string) => void,
  setPendingKey: (string) => void
|}
export default createContext<ContextType>({
  activeKey: null,
  pendingKey: null,
  setActiveKey: () => {},
  setPendingKey: () => {}
})
