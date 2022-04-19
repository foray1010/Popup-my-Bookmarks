import * as React from 'react'

import { BASE_WINDOW } from '../../constants/windows'
import { useBookmarkTrees } from '../../modules/bookmarks/contexts/bookmarkTrees'
import { useKeyBindingsEvent } from '../keyBindings'
import SearchInput from './SearchInput'

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
  useKeyBindingsEvent({ key: /^.$/, windowId: BASE_WINDOW }, () => {
    const isFocusedOnInput = document.activeElement instanceof HTMLInputElement
    if (isFocusedOnInput) return

    if (inputRef.current) inputRef.current.focus()
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
