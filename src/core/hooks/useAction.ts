import * as React from 'react'
import { useDispatch } from 'react-redux'
import type { Action, Dispatch } from 'redux'

export default function useAction<
  T extends Array<unknown>,
  U extends Action<string>,
>(action: (...args: T) => U) {
  const dispatch = useDispatch<Dispatch<U>>()

  return React.useCallback(
    (...args: T) => {
      return dispatch(action(...args))
    },
    [action, dispatch],
  )
}
