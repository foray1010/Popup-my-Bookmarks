import * as React from 'react'
import {useDispatch} from 'react-redux'
import {Action, Dispatch} from 'redux'

const useAction = <T, U extends Array<T>, V extends Action<string>>(action: (...args: U) => V) => {
  const dispatch = useDispatch<Dispatch<V>>()

  return React.useCallback(
    (...args: U) => {
      return dispatch(action(...args))
    },
    [action, dispatch]
  )
}

export default useAction
