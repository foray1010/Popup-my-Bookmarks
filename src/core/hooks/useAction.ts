import * as React from 'react'
import { useDispatch } from 'react-redux'
import { Action, Dispatch } from 'redux'

const useAction = <T extends Array<any>, U extends Action<string>>(
  action: (...args: T) => U,
) => {
  const dispatch = useDispatch<Dispatch<U>>()

  return React.useCallback(
    (...args: T) => {
      return dispatch(action(...args))
    },
    [action, dispatch],
  )
}

export default useAction
