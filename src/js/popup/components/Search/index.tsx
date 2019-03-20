import * as React from 'react'
import {connect} from 'react-redux'

import {RootState, bookmarkCreators, uiCreators} from '../../reduxs'
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

  React.useEffect(() => {
    const handleDocumentKeyDown = (evt: KeyboardEvent) => {
      const isCharKey = evt.key.length === 1
      const notFocusOnInputElement =
        !document.activeElement || !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
      if (notFocusOnInputElement && isCharKey) {
        setIsFocusSearchInput(true)
      }
    }

    document.addEventListener('keydown', handleDocumentKeyDown)

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown)
    }
  }, [setIsFocusSearchInput])

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
