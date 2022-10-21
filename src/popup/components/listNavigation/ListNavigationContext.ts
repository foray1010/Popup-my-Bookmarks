import constate from 'constate'
import * as React from 'react'

import deleteFromMap from '../../utils/deleteFromMap.js'

const useListNavigation = () => {
  const [highlightedIndices, setHighlightedIndices] = React.useState(
    new Map<number, number>(),
  )

  const setHighlightedIndex = React.useCallback(
    (listIndex: number, itemIndex: number) => {
      setHighlightedIndices((prevState) =>
        new Map(prevState).set(listIndex, itemIndex),
      )
    },
    [],
  )

  const unsetHighlightedIndex = React.useCallback(
    (listIndex: number, itemIndex: number) => {
      setHighlightedIndices((prevState) => {
        if (prevState.get(listIndex) !== itemIndex) return prevState

        return deleteFromMap(prevState, listIndex)
      })
    },
    [],
  )

  const [itemCounts, setItemCounts] = React.useState(new Map<number, number>())

  const setItemCount = React.useCallback(
    (listIndex: number, itemCount: number) => {
      setItemCounts((prevState) => new Map(prevState).set(listIndex, itemCount))
    },
    [],
  )

  const removeList = React.useCallback((listIndex: number) => {
    setHighlightedIndices((prevState) => deleteFromMap(prevState, listIndex))
    setItemCounts((prevState) => deleteFromMap(prevState, listIndex))
  }, [])

  return React.useMemo(
    () => ({
      listNavigation: { highlightedIndices, itemCounts },
      setHighlightedIndex,
      unsetHighlightedIndex,
      setItemCount,
      removeList,
    }),
    [
      highlightedIndices,
      itemCounts,
      removeList,
      setHighlightedIndex,
      setItemCount,
      unsetHighlightedIndex,
    ],
  )
}

export const [ListNavigationProvider, useListNavigationContext] =
  constate(useListNavigation)
