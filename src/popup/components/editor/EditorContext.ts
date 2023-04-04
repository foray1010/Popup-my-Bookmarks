import constate from 'constate'
import * as React from 'react'

type OpenParams = (
  | {
      readonly isCreating: true
      readonly createAfterId: string
    }
  | {
      readonly isCreating: false
      readonly editTargetId: string
    }
) & {
  readonly isAllowedToEditUrl: boolean
  readonly positions?: { readonly top: number; readonly left: number }
}

type State =
  | {
      readonly isOpen: false
    }
  | ({
      readonly isOpen: true
    } & Required<OpenParams>)

const initialState: State = {
  isOpen: false,
}

const useEditor = () => {
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
