import type { ValueOf } from 'type-fest'

import type { WindowId } from '../../constants/windows.js'
import cycle from '../../utils/cycle.js'
import getLastMapKey from '../../utils/getLastMapKey.js'
import { useKeyBindingsEvent } from '../keyBindings/index.js'
import { useListNavigationContext } from './ListNavigationContext.js'

export default function useKeyboardNav({
  windowId,
  onPressArrowLeft,
  onPressArrowRight,
}: Readonly<{
  windowId: ValueOf<typeof WindowId>
  onPressArrowLeft?: (evt: Readonly<KeyboardEvent>) => void
  onPressArrowRight?: (evt: Readonly<KeyboardEvent>) => void
}>): void {
  const { listNavigation, removeList, setHighlightedIndex } =
    useListNavigationContext()

  function handlePressArrowVertical(offset: number) {
    const { highlightedIndices, itemCounts } = listNavigation

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
  }

  function handlePressArrowDown() {
    handlePressArrowVertical(1)
  }
  useKeyBindingsEvent({ key: 'ArrowDown', windowId }, handlePressArrowDown)

  function handlePressArrowUp() {
    handlePressArrowVertical(-1)
  }
  useKeyBindingsEvent({ key: 'ArrowUp', windowId }, handlePressArrowUp)

  useKeyBindingsEvent({ key: 'Tab', windowId }, (evt) => {
    // do not use default focusable orders for now, as it does not work with virtualized lists
    evt.preventDefault()

    if (evt.shiftKey) {
      handlePressArrowUp()
    } else {
      handlePressArrowDown()
    }
  })

  useKeyBindingsEvent({ key: 'ArrowLeft', windowId }, (evt) => {
    onPressArrowLeft?.(evt)

    const { itemCounts } = listNavigation
    if (itemCounts.size <= 1) return

    const lastListIndex = getLastMapKey(itemCounts)
    if (lastListIndex === undefined) return

    removeList(lastListIndex)
  })

  useKeyBindingsEvent({ key: 'ArrowRight', windowId }, (evt) => {
    onPressArrowRight?.(evt)

    const { itemCounts } = listNavigation

    const lastListIndex = getLastMapKey(itemCounts)
    if (lastListIndex === undefined) return

    setHighlightedIndex(lastListIndex + 1, 0)
  })
}
