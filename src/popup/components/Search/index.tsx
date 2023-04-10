import * as React from 'react'

import { WindowId } from '../../constants/windows.js'
import { useBookmarkTrees } from '../../modules/bookmarks/contexts/bookmarkTrees.js'
import { useKeyBindingsEvent } from '../keyBindings/index.js'
import SearchInput from './SearchInput.js'

export default function SearchContainer() {
  const [inputValue, setInputValue] = React.useState('')
  const [, startTransition] = React.useTransition()

  const { setSearchQuery } = useBookmarkTrees()

  React.useEffect(() => {
    startTransition(() => {
      setSearchQuery(inputValue)
    })
  }, [setSearchQuery, inputValue])

  const inputRef = React.useRef<HTMLInputElement>(null)
  useKeyBindingsEvent({ key: /^.$/, windowId: WindowId.Base }, () => {
    const isFocusedOnInput = document.activeElement instanceof HTMLInputElement
    if (isFocusedOnInput) return

    inputRef.current?.focus()
  })

  return (
    <SearchInput
      ref={inputRef}
      tabIndex={-1}
      value={inputValue}
      onCancel={React.useCallback(() => setInputValue(''), [])}
      onChange={React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
        (evt) => setInputValue(evt.currentTarget.value),
        [],
      )}
    />
  )
}
