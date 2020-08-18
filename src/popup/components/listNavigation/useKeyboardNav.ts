import * as React from 'react'

import cycle from '../../utils/cycle'
import getLastMapKey from '../../utils/getLastMapKey'
import useKeyBindingsEvent from '../keyBindings/useKeyBindingsEvent'
import { useListNavigationContext } from './ListNavigationContext'

export default ({
  windowId,
  onPressArrowDown,
  onPressArrowLeft,
  onPressArrowRight,
  onPressArrowUp,
}: {
  windowId: string
  onPressArrowDown?: (evt: KeyboardEvent) => void
  onPressArrowLeft?: (evt: KeyboardEvent) => void
  onPressArrowRight?: (evt: KeyboardEvent) => void
  onPressArrowUp?: (evt: KeyboardEvent) => void
}) => {
  const { lists, removeList, setHighlightedIndex } = useListNavigationContext()

  const listsRef = React.useRef(lists)
  listsRef.current = lists

  const handlePressArrowVertical = React.useCallback(
    (offset: number) => {
      const { highlightedIndices, itemCounts } = listsRef.current

      const lastListIndex = getLastMapKey(itemCounts)
      if (lastListIndex === undefined) return

      const itemCount = itemCounts.get(lastListIndex)
      if (itemCount === undefined) return

      const currentItemIndex = highlightedIndices.get(lastListIndex)
      const nextItemIndex = cycle(
        0,
        itemCount - 1,
        (currentItemIndex !== undefined ? currentItemIndex : -1) + offset,
      )
      setHighlightedIndex(lastListIndex, nextItemIndex)
    },
    [setHighlightedIndex],
  )

  const handlePressArrowDown = React.useCallback(
    (evt: KeyboardEvent) => {
      if (onPressArrowDown) onPressArrowDown(evt)

      handlePressArrowVertical(1)
    },
    [handlePressArrowVertical, onPressArrowDown],
  )
  useKeyBindingsEvent({ key: 'ArrowDown', windowId }, handlePressArrowDown)

  const handlePressArrowUp = React.useCallback(
    (evt: KeyboardEvent) => {
      if (onPressArrowUp) onPressArrowUp(evt)

      handlePressArrowVertical(-1)
    },
    [handlePressArrowVertical, onPressArrowUp],
  )
  useKeyBindingsEvent({ key: 'ArrowUp', windowId }, handlePressArrowUp)

  useKeyBindingsEvent({ key: 'Tab', windowId }, (evt) => {
    if (evt.shiftKey) {
      handlePressArrowUp(evt)
    } else {
      handlePressArrowDown(evt)
    }
  })

  useKeyBindingsEvent({ key: 'ArrowLeft', windowId }, (evt) => {
    if (onPressArrowLeft) onPressArrowLeft(evt)

    const { itemCounts } = listsRef.current
    if (itemCounts.size <= 1) return

    const lastListIndex = getLastMapKey(itemCounts)
    if (lastListIndex === undefined) return

    removeList(lastListIndex)
  })

  useKeyBindingsEvent({ key: 'ArrowRight', windowId }, (evt) => {
    if (onPressArrowRight) onPressArrowRight(evt)

    const { itemCounts } = listsRef.current

    const lastListIndex = getLastMapKey(itemCounts)
    if (lastListIndex === undefined) return

    setHighlightedIndex(lastListIndex + 1, 0)
  })
}
