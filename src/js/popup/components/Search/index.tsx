import * as React from 'react'
import {connect} from 'react-redux'

import {BASE_WINDOW} from '../../constants/windows'
import {RootState, bookmarkCreators, uiCreators} from '../../reduxs'
import useKeyBindingsEvent from '../keyBindings/useKeyBindingsEvent'
import Search from './Search'

const mapStateToProps = (state: RootState) => ({
  isFocusSearchInput: state.ui.isFocusSearchInput
})

const mapDispatchToProps = {
  getSearchResult: bookmarkCreators.getSearchResult,
  setIsFocusSearchInput: uiCreators.setIsFocusSearchInput
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
const SearchContainer = ({getSearchResult, isFocusSearchInput, setIsFocusSearchInput}: Props) => {
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
    />
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchContainer)
