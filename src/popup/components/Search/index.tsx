import { startTransition, useRef, useState } from 'react'

import { WindowId } from '@/popup/constants/windows.js'
import { useBookmarkTreesContext } from '@/popup/modules/bookmarks/contexts/bookmarkTrees.js'

import { useKeyBindingsEvent } from '../keyBindings/index.js'
import SearchInput from './SearchInput.js'

export default function SearchContainer() {
  const [inputValue, setInputValue] = useState('')

  const { setSearchQuery } = useBookmarkTreesContext()
  const executeSearch = (value: string) => {
    startTransition(() => {
      setSearchQuery(value)
    })
  }

  const updateInputValue = ({
    value,
    isComposing,
  }: Readonly<{
    value: string
    isComposing: boolean
  }>): void => {
    setInputValue(value)

    // do not search during IME composition
    if (!isComposing) {
      executeSearch(value)
    }
  }

  const inputRef = useRef<HTMLInputElement>(null)
  useKeyBindingsEvent({ key: /^.$/u, windowId: WindowId.Base }, () => {
    const isFocusedOnInput = document.activeElement instanceof HTMLInputElement
    if (isFocusedOnInput) return

    inputRef.current?.focus()
  })

  return (
    <SearchInput
      ref={inputRef}
      value={inputValue}
      onCancel={() => updateInputValue({ value: '', isComposing: false })}
      onChange={(evt) => {
        updateInputValue({
          value: evt.currentTarget.value,
          isComposing: (evt.nativeEvent as InputEvent).isComposing,
        })
      }}
      onCompositionEnd={() => executeSearch(inputValue)}
    />
  )
}
