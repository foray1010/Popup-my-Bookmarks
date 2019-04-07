import * as React from 'react'

import ListNavigationContext from './ListNavigationContext'
import useListNavigationContextState from './useListNavigationContextState'

interface Props {
  children: React.ReactNode
}
const ListNavigationProvider = (props: Props) => {
  const contextState = useListNavigationContextState()

  return (
    <ListNavigationContext.Provider value={contextState}>
      {props.children}
    </ListNavigationContext.Provider>
  )
}

export default ListNavigationProvider
