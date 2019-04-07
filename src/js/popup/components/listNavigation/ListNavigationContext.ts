import * as React from 'react'

export interface ListNavigationContextType {
  lists: {
    highlightedIndices: Map<number, number>
    itemCounts: Map<number, number>
  }

  removeList: (listIndex: number) => void
  resetLists: () => void
  setHighlightedIndex: (listIndex: number, itemIndex: number) => void
  setItemCount: (listIndex: number, itemCount: number) => void
  unsetHighlightedIndex: (listIndex: number, itemIndex: number) => void
}

export const initialLists: ListNavigationContextType['lists'] = {
  highlightedIndices: new Map(),
  itemCounts: new Map()
}

export default React.createContext<ListNavigationContextType>({
  lists: initialLists,

  removeList: () => {},
  resetLists: () => {},
  setHighlightedIndex: () => {},
  setItemCount: () => {},
  unsetHighlightedIndex: () => {}
})
