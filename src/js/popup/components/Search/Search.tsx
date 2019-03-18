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
class Search extends React.PureComponent<Props> {
  public componentDidMount() {
    if (this.props.isFocus) this.focusToInputEl()
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.isFocus !== this.props.isFocus && this.props.isFocus) {
      this.focusToInputEl()
    }
  }

  private inputRef = React.createRef<HTMLInputElement>()

  private focusToInputEl = () => {
    if (this.inputRef.current && this.inputRef.current !== document.activeElement) {
      this.inputRef.current.focus()
    }
  }

  public render = () => (
    <div className={classes.main}>
      <input
        ref={this.inputRef}
        type='search'
        placeholder={webExtension.i18n.getMessage('search')}
        value={this.props.inputValue}
        tabIndex={-1}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
        onChange={this.props.onChange}
      />
    </div>
  )
}

export default Search
