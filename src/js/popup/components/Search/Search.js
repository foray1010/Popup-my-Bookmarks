// @flow strict

import * as React from 'react'
import webExtension from 'webextension-polyfill'

import classes from '../../../../css/popup/search.css'

type Props = {|
  inputValue: string,
  isFocus: boolean,
  onBlur: () => void,
  onChange: (SyntheticInputEvent<HTMLInputElement>) => void,
  onFocus: () => void
|}
class Search extends React.PureComponent<Props> {
  inputEl: ?HTMLElement

  componentDidMount() {
    if (this.props.isFocus) this.focusToInputEl()
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isFocus !== this.props.isFocus && this.props.isFocus) {
      this.focusToInputEl()
    }
  }

  focusToInputEl = () => {
    if (this.inputEl && this.inputEl !== document.activeElement) {
      this.inputEl.focus()
    }
  }

  render = () => (
    <div className={classes.main}>
      <input
        ref={(ref) => {
          this.inputEl = ref
        }}
        type='search'
        placeholder={webExtension.i18n.getMessage('search')}
        value={this.props.inputValue}
        tabIndex='-1'
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
        onChange={this.props.onChange}
      />
    </div>
  )
}

export default Search
