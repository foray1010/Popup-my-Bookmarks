import { startTransition, useRef, useState } from 'react'

import { WindowId } from '../../constants/windows.js'
import { useBookmarkTreesContext } from '../../modules/bookmarks/contexts/bookmarkTrees.js'
import { useKeyBindingsEvent } from '../keyBindings/index.js'
import SearchInput from './SearchInput.js'

export default function SearchContainer() {
  const [isComposing, setIsComposing] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const { setSearchQuery } = useBookmarkTreesContext()

  const updateInputValue = (value: string): void => {
    setInputValue(value)

    // do not search during IME composition
    if (!isComposing) {
      startTransition(() => {
        setSearchQuery(inputValue)
      })
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
      onCancel={() => updateInputValue('')}
      onChange={(evt) => updateInputValue(evt.currentTarget.value)}
      onCompositionEnd={() => setIsComposing(false)}
      onCompositionStart={() => setIsComposing(true)}
    />
  )
}
