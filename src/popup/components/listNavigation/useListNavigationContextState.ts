import * as React from 'react'

import useMapDispatchToCallback from '../../hooks/useMapDispatchToCallback'
import {ListNavigationContextType} from './ListNavigationContext'
import {listsCreators, listsInitialState, listsReducer} from './reducers/lists'

const useListNavigationContextState = (): ListNavigationContextType => {
  const [lists, dispatch] = React.useReducer(listsReducer, listsInitialState)

  const removeList = useMapDispatchToCallback(dispatch, listsCreators.removeList)
  const resetLists = useMapDispatchToCallback(dispatch, listsCreators.resetLists)
  const setHighlightedIndex = useMapDispatchToCallback(dispatch, listsCreators.setHighlightedIndex)
  const setItemCount = useMapDispatchToCallback(dispatch, listsCreators.setItemCount)
  const unsetHighlightedIndex = useMapDispatchToCallback(
    dispatch,
    listsCreators.unsetHighlightedIndex
  )

  return React.useMemo(
    () => ({
      lists,
      removeList,
      resetLists,
      setHighlightedIndex,
      setItemCount,
      unsetHighlightedIndex
    }),
    [lists, removeList, resetLists, setHighlightedIndex, setItemCount, unsetHighlightedIndex]
  )
}

export default useListNavigationContextState
