import constate from 'constate'
import * as React from 'react'

type OpenState = {
  readonly targetId: string
  readonly displayPositions: { readonly top: number; readonly left: number }
  readonly targetPositions: { readonly top: number; readonly left: number }
}

type State =
  | {
      readonly isOpen: false
    }
  | ({
      readonly isOpen: true
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
