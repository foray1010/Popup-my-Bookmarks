// @flow
// @jsx createElement

import '../../../../css/popup/search.css'

import {createElement} from 'react'
import webExtension from 'webextension-polyfill'

type Props = {
  inputValue: string,
  onInput: (SyntheticInputEvent<HTMLInputElement>) => void
};
const Search = (props: Props) => (
  <div styleName='main'>
    <input
      id='search'
      type='search'
      placeholder={webExtension.i18n.getMessage('search')}
      value={props.inputValue}
      tabIndex='-1'
      onInput={props.onInput}
    />
  </div>
)

export default Search
