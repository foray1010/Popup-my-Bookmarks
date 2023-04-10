import constate from 'constate'
import * as React from 'react'

import deleteFromMap from '../../utils/deleteFromMap.js'

function useListNavigation() {
  const [highlightedIndices, setHighlightedIndices] = React.useState<
    ReadonlyMap<number, number>
  >(new Map())

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

  const [itemCounts, setItemCounts] = React.useState<
    ReadonlyMap<number, number>
  >(new Map())

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

  return {
    listNavigation: { highlightedIndices, itemCounts },
    setHighlightedIndex,
    unsetHighlightedIndex,
    setItemCount,
    removeList,
  }
}

export const [ListNavigationProvider, useListNavigationContext] =
  constate(useListNavigation)
