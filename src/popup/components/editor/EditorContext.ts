import constate from 'constate'
import * as React from 'react'

type OpenParams = Readonly<
  (
    | {
        isCreating: true
        createAfterId: string
      }
    | {
        isCreating: false
        editTargetId: string
      }
  ) & {
    isAllowedToEditUrl: boolean
    positions?: { top: number; left: number }
  }
>

type State = Readonly<
  | {
      isOpen: false
    }
  | ({
      isOpen: true
    } & Required<OpenParams>)
>

const initialState: State = {
  isOpen: false,
}

function useEditor() {
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

  return {
    close,
    open,
    state,
  }
}

export const [EditorProvider, useEditorContext] = constate(useEditor)
