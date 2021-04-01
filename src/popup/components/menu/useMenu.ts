import constate from 'constate'
import * as React from 'react'

export type OpenState = {
  targetId: string
  displayPositions: { top: number; left: number }
  targetPositions: { top: number; left: number }
}

type State =
  | {
      isOpen: false
    }
  | ({
      isOpen: true
    } & OpenState)

const initialState: State = {
  isOpen: false,
}

const useMenu = () => {
  const [state, setState] = React.useState<State>(initialState)

  const open = React.useCallback((openState: OpenState) => {
    setState({
      ...openState,
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
