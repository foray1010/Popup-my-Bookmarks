import * as React from 'react'

const useMapDispatchToCallback = <T, U extends Array<unknown>>(
  dispatch: React.Dispatch<T>,
  creator: (...args: U) => T,
) => {
  return React.useCallback(
    (...args: U) => {
      dispatch(creator(...args))
    },
    [creator, dispatch],
  )
}

export default useMapDispatchToCallback
