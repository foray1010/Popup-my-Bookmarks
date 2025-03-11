import constate from 'constate'
import { useCallback, useState } from 'react'

export const ClipboardAction = {
  Copy: 'copy',
  Cut: 'cut',
  None: 'none',
} as const

type ClipboardState = Readonly<
  | {
      action: (typeof ClipboardAction)['None']
    }
  | {
      action: (typeof ClipboardAction)['Copy'] | (typeof ClipboardAction)['Cut']
      items: ReadonlySet<string>
    }
>

const initialState = {
  action: ClipboardAction.None,
} as const satisfies ClipboardState

function useClipboard() {
  const [state, setState] = useState<ClipboardState>(initialState)

  const reset = useCallback(() => setState(initialState), [])

  return {
    state,
    reset,
    set: setState,
  }
}

export const [ClipboardProvider, useClipboardContext] = constate(useClipboard)
