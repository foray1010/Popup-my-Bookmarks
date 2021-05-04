import constate from 'constate'
import * as React from 'react'

export enum ClipboardAction {
  Copy = 'copy',
  Cut = 'cut',
  None = 'none',
}

type ClipboardState =
  | {
      action: ClipboardAction.None
    }
  | {
      action: ClipboardAction.Copy | ClipboardAction.Cut
      items: ReadonlyArray<{
        id: string
      }>
    }

const initialState: ClipboardState = {
  action: ClipboardAction.None,
}

const useClipboardState = () => {
  const [state, setState] = React.useState<ClipboardState>(initialState)

  const reset = React.useCallback(() => {
    setState(initialState)
  }, [])

  const set = React.useCallback((newState: ClipboardState) => {
    setState(newState)
  }, [])

  return React.useMemo(() => {
    return {
      state,
      reset,
      set,
    }
  }, [state, reset, set])
}

export const [ClipboardProvider, useClipboard] = constate(useClipboardState)
