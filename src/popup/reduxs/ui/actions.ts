import {createAction} from 'typesafe-actions'

export const setHighlightedItemCoordinates = createAction(
  'SET_HIGHLIGHTED_ITEM_COORDINATES',
  (action) => (highlightedItemCoordinates: {positionLeft: number, positionTop: number}) =>
    action({highlightedItemCoordinates})
)

export const setIsFocusSearchInput = createAction(
  'SET_IS_FOCUS_SEARCH_INPUT',
  (action) => (isFocusSearchInput: boolean) => action({isFocusSearchInput})
)
