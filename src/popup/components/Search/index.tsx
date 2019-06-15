import * as React from 'react'
import {useSelector} from 'react-redux'

import useAction from '../../../core/hooks/useAction'
import {BASE_WINDOW} from '../../constants/windows'
import {RootState, bookmarkCreators, uiCreators} from '../../reduxs'
import useKeyBindingsEvent from '../keyBindings/useKeyBindingsEvent'
import Search from './Search'

const SearchContainer = () => {
  const isFocusSearchInput = useSelector((state: RootState) => state.ui.isFocusSearchInput)

  const getSearchResult = useAction(bookmarkCreators.getSearchResult)
  const setIsFocusSearchInput = useAction(uiCreators.setIsFocusSearchInput)

  const [inputValue, setInputValue] = React.useState('')

  React.useEffect(() => {
    getSearchResult(inputValue)
  }, [getSearchResult, inputValue])

  const handleSingleKeyPress = React.useCallback(
    (evt: KeyboardEvent) => {
      const isFocusedOnInput = document.activeElement instanceof HTMLInputElement
      if (!isFocusedOnInput) {
        setInputValue(evt.key)
        setIsFocusSearchInput(true)
      }
    },
    [setIsFocusSearchInput]
  )
  useKeyBindingsEvent({key: /^.$/, windowId: BASE_WINDOW}, handleSingleKeyPress)

  const handleBlur = React.useCallback(() => {
    setIsFocusSearchInput(false)
  }, [setIsFocusSearchInput])

  const handleChange = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(evt.currentTarget.value)
  }, [])

  const handleFocus = React.useCallback(() => {
    setIsFocusSearchInput(true)
  }, [setIsFocusSearchInput])

  return (
    <Search
      inputValue={inputValue}
      isFocus={isFocusSearchInput}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onChange={handleChange}
      setInputValue={setInputValue}
    />
  )
}

export default SearchContainer
