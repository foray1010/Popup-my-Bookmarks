// @flow strict
// @jsx createElement

import '../../../../css/popup/search.css'

import {PureComponent, createElement} from 'react'
import webExtension from 'webextension-polyfill'

type Props = {|
  inputValue: string,
  isFocus: boolean,
  onBlur: () => void,
  onFocus: () => void,
  onInput: (SyntheticInputEvent<HTMLInputElement>) => void
|}
class Search extends PureComponent<Props> {
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

  inputEl: ?HTMLElement
  render = () => (
    <div styleName='main'>
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
        onInput={this.props.onInput}
      />
    </div>
  )
}

export default Search
