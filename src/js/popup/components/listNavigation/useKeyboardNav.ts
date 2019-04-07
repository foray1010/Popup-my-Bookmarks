import * as React from 'react'

import cycle from '../../utils/cycle'
import getLastMapKey from '../../utils/getLastMapKey'
import useKeyBindingsEvent from '../keyBindings/useKeyBindingsEvent'
import ListNavigationContext from './ListNavigationContext'

export default ({
  level,
  onPressArrowDown,
  onPressArrowLeft,
  onPressArrowRight,
  onPressArrowUp
}: {
  level?: number
  onPressArrowDown?: (evt: KeyboardEvent) => void
  onPressArrowLeft?: (evt: KeyboardEvent) => void
  onPressArrowRight?: (evt: KeyboardEvent) => void
  onPressArrowUp?: (evt: KeyboardEvent) => void
}) => {
  const {lists, removeList, setHighlightedIndex} = React.useContext(ListNavigationContext)

  const listsRef = React.useRef(lists)
  listsRef.current = lists

  const handlePressArrowVertical = React.useCallback(
    (offset: number) => () => {
      const {highlightedIndices, itemCounts} = listsRef.current

      const lastListIndex = getLastMapKey(itemCounts)
      if (lastListIndex === undefined) return

      const itemCount = itemCounts.get(lastListIndex)
      if (itemCount === undefined) return

      const currentItemIndex = highlightedIndices.get(lastListIndex)
      const nextItemIndex = cycle(
        0,
        itemCount - 1,
        (currentItemIndex !== undefined ? currentItemIndex : -1) + offset
      )
      setHighlightedIndex(lastListIndex, nextItemIndex)
    },
    [setHighlightedIndex]
  )

  const handlePressArrowDown = React.useCallback(
    (evt: KeyboardEvent) => {
      if (onPressArrowDown) onPressArrowDown(evt)

      handlePressArrowVertical(1)()
    },
    [handlePressArrowVertical, onPressArrowDown]
  )
  useKeyBindingsEvent({key: 'ArrowDown', level}, handlePressArrowDown)

  const handlePressArrowUp = React.useCallback(
    (evt: KeyboardEvent) => {
      if (onPressArrowUp) onPressArrowUp(evt)

      handlePressArrowVertical(-1)()
    },
    [handlePressArrowVertical, onPressArrowUp]
  )
  useKeyBindingsEvent({key: 'ArrowUp', level}, handlePressArrowUp)

  const handlePressTab = React.useCallback(
    (evt: KeyboardEvent) => {
      if (evt.shiftKey) {
        handlePressArrowUp(evt)
      } else {
        handlePressArrowDown(evt)
      }
    },
    [handlePressArrowDown, handlePressArrowUp]
  )
  useKeyBindingsEvent({key: 'Tab', level}, handlePressTab)

  const handlePressArrowLeft = React.useCallback(
    (evt: KeyboardEvent) => {
      if (onPressArrowLeft) onPressArrowLeft(evt)

      const {itemCounts} = listsRef.current

      if (itemCounts.size <= 1) return

      const lastListIndex = getLastMapKey(itemCounts)
      if (lastListIndex === undefined) return

      removeList(lastListIndex)
    },
    [onPressArrowLeft, removeList]
  )
  useKeyBindingsEvent({key: 'ArrowLeft', level}, handlePressArrowLeft)

  const handlePressArrowRight = React.useCallback(
    (evt: KeyboardEvent) => {
      if (onPressArrowRight) onPressArrowRight(evt)

      const {itemCounts} = listsRef.current

      const lastListIndex = getLastMapKey(itemCounts)
      if (lastListIndex === undefined) return

      setHighlightedIndex(lastListIndex + 1, 0)
    },
    [onPressArrowRight, setHighlightedIndex]
  )
  useKeyBindingsEvent({key: 'ArrowRight', level}, handlePressArrowRight)
}
