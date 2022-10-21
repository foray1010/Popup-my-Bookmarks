import cycle from '../../utils/cycle.js'
import getLastMapKey from '../../utils/getLastMapKey.js'
import { useKeyBindingsEvent } from '../keyBindings/index.js'
import { useListNavigationContext } from './ListNavigationContext.js'

export default function useKeyboardNav({
  windowId,
  onPressArrowDown,
  onPressArrowLeft,
  onPressArrowRight,
  onPressArrowUp,
}: {
  readonly windowId: string
  readonly onPressArrowDown?: (evt: KeyboardEvent) => void
  readonly onPressArrowLeft?: (evt: KeyboardEvent) => void
  readonly onPressArrowRight?: (evt: KeyboardEvent) => void
  readonly onPressArrowUp?: (evt: KeyboardEvent) => void
}): void {
  const { listNavigation, removeList, setHighlightedIndex } =
    useListNavigationContext()

  const handlePressArrowVertical = (offset: number) => {
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

  const handlePressArrowDown = (evt: KeyboardEvent) => {
    if (onPressArrowDown) onPressArrowDown(evt)

    handlePressArrowVertical(1)
  }
  useKeyBindingsEvent({ key: 'ArrowDown', windowId }, handlePressArrowDown)

  const handlePressArrowUp = (evt: KeyboardEvent) => {
    if (onPressArrowUp) onPressArrowUp(evt)

    handlePressArrowVertical(-1)
  }
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

    const { itemCounts } = listNavigation
    if (itemCounts.size <= 1) return

    const lastListIndex = getLastMapKey(itemCounts)
    if (lastListIndex === undefined) return

    removeList(lastListIndex)
  })

  useKeyBindingsEvent({ key: 'ArrowRight', windowId }, (evt) => {
    if (onPressArrowRight) onPressArrowRight(evt)

    const { itemCounts } = listNavigation

    const lastListIndex = getLastMapKey(itemCounts)
    if (lastListIndex === undefined) return

    setHighlightedIndex(lastListIndex + 1, 0)
  })
}
