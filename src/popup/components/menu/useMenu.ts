import constate from 'constate'
import { useCallback, useState } from 'react'

type OpenState = Readonly<{
  targetId: string
  displayPositions: Readonly<{ top: number; left: number }>
  targetPositions: Readonly<{ top: number; left: number }>
}>

type State = Readonly<
  | {
      isOpen: false
    }
  | ({
      isOpen: true
    } & OpenState)
>

const initialState: State = {
  isOpen: false,
}

function useMenu() {
  const [state, setState] = useState<State>(initialState)

  const open = useCallback((openState: OpenState) => {
    setState({
      ...openState,
      isOpen: true,
    })
  }, [])

  const close = useCallback(() => {
    setState(initialState)
  }, [])

  return {
    close,
    open,
    state,
  }
}

export const [MenuProvider, useMenuContext] = constate(useMenu)
