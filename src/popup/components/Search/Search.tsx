import * as React from 'react'
import webExtension from 'webextension-polyfill'

import cancelIcon from '../../images/cancel.svg'
import searchIcon from '../../images/search.svg'
import classes from './search.css'

interface Props {
  inputValue: string
  isFocus: boolean
  onBlur: React.FocusEventHandler<HTMLInputElement>
  onChange: React.ChangeEventHandler<HTMLInputElement>
  onFocus: React.FocusEventHandler<HTMLInputElement>
  setInputValue: (inputValue: string) => void
}
const Search = ({inputValue, isFocus, setInputValue, ...restProps}: Props) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isFocus && inputRef.current !== document.activeElement) {
      if (inputRef.current) inputRef.current.focus()
    }
  }, [isFocus])

  const resetInputValue = React.useCallback(() => {
    setInputValue('')
  }, [setInputValue])

  return (
    <div className={classes.main}>
      <img className={classes['search-icon']} src={searchIcon} alt='' />
      <input
        ref={inputRef}
        className={classes['search-input']}
        type='text'
        placeholder={webExtension.i18n.getMessage('search')}
        value={inputValue}
        tabIndex={-1}
        onBlur={restProps.onBlur}
        onFocus={restProps.onFocus}
        onChange={restProps.onChange}
      />
      {inputValue ? (
        <img className={classes['cancel-icon']} src={cancelIcon} alt='' onClick={resetInputValue} />
      ) : null}
    </div>
  )
}

export default Search
