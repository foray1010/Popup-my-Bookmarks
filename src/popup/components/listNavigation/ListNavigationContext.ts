import * as React from 'react'

import { ListsState, listsInitialState } from './reducers/lists'

export interface ListNavigationContextType {
  lists: ListsState

  removeList: (listIndex: number) => void
  resetLists: () => void
  setHighlightedIndex: (listIndex: number, itemIndex: number) => void
  setItemCount: (listIndex: number, itemCount: number) => void
  unsetHighlightedIndex: (listIndex: number, itemIndex: number) => void
}

export default React.createContext<ListNavigationContextType>({
  lists: listsInitialState,

  removeList: () => {},
  resetLists: () => {},
  setHighlightedIndex: () => {},
  setItemCount: () => {},
  unsetHighlightedIndex: () => {},
})
