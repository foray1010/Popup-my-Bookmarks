import * as React from 'react'
import webExtension from 'webextension-polyfill'

import classes from '../../../../css/popup/search.css'

interface Props {
  inputValue: string
  isFocus: boolean
  onBlur: () => void
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void
  onFocus: () => void
}
const Search = ({isFocus, ...restProps}: Props) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (isFocus && inputRef.current !== document.activeElement) {
      if (inputRef.current) inputRef.current.focus()
    }
  }, [isFocus])

  return (
    <div className={classes.main}>
      <input
        ref={inputRef}
        type='search'
        placeholder={webExtension.i18n.getMessage('search')}
        value={restProps.inputValue}
        tabIndex={-1}
        onBlur={restProps.onBlur}
        onFocus={restProps.onFocus}
        onChange={restProps.onChange}
      />
    </div>
  )
}

export default Search
