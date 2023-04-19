import * as React from 'react'

import { WindowId } from '../../constants/windows.js'
import { useBookmarkTreesContext } from '../../modules/bookmarks/contexts/bookmarkTrees.js'
import { useKeyBindingsEvent } from '../keyBindings/index.js'
import SearchInput from './SearchInput.js'

export default function SearchContainer() {
  const [isComposing, setIsComposing] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [, startTransition] = React.useTransition()

  const { setSearchQuery } = useBookmarkTreesContext()

  React.useEffect(() => {
    startTransition(() => {
      // do not search during IME composition
      if (isComposing) return

      setSearchQuery(inputValue)
    })
  }, [setSearchQuery, inputValue, isComposing])

  const inputRef = React.useRef<HTMLInputElement>(null)
  useKeyBindingsEvent({ key: /^.$/, windowId: WindowId.Base }, () => {
    const isFocusedOnInput = document.activeElement instanceof HTMLInputElement
    if (isFocusedOnInput) return

    inputRef.current?.focus()
  })

  return (
    <SearchInput
      ref={inputRef}
      value={inputValue}
      onCancel={() => setInputValue('')}
      onChange={(evt) => setInputValue(evt.currentTarget.value)}
      onCompositionEnd={() => setIsComposing(false)}
      onCompositionStart={() => setIsComposing(true)}
    />
  )
}
