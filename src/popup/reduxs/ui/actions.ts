import { createAction } from 'typesafe-actions'

export const setHighlightedItemCoordinates = createAction(
  'SET_HIGHLIGHTED_ITEM_COORDINATES',
  (highlightedItemCoordinates: {
    positionLeft: number
    positionTop: number
  }) => ({ highlightedItemCoordinates }),
)()
