// @flow strict

import {createContext} from 'react'

export type ContextType = {|
  activeKey: string | null,
  setActiveKey: (string) => void
|}
export default createContext<ContextType>({
  activeKey: null,
  setActiveKey: () => {}
})
