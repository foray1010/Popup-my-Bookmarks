// @flow strict

import * as React from 'react'

export type ContextType = {|
  activeKey: string | null,
  pendingKey: string | null,
  setActiveKey: (string) => void,
  setPendingKey: (string) => void
|}
export default React.createContext<ContextType>({
  activeKey: null,
  pendingKey: null,
  setActiveKey: () => {},
  setPendingKey: () => {}
})
