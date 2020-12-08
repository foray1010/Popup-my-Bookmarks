import constate from 'constate'
import * as React from 'react'

type OpenParams = {
  targetId: string
  positions?: { top: number; left: number }
}

type State =
  | {
      isOpen: false
    }
  | ({
      isOpen: true
    } & Required<OpenParams>)

const initialState: State = {
  isOpen: false,
}

const useMenu = () => {
  const [state, setState] = React.useState<State>(initialState)

  const open = React.useCallback((openParams: OpenParams) => {
    setState({
      positions: { top: 0, left: 0 },
      ...openParams,
      isOpen: true,
    })
  }, [])

  const close = React.useCallback(() => {
    setState(initialState)
  }, [])

  return React.useMemo(() => {
    return {
      close,
      open,
      state,
    }
  }, [close, open, state])
}

export const [MenuProvider, useMenuContext] = constate(useMenu)
