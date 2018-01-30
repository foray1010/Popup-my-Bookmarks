import PropTypes from 'prop-types'
import webExtension from 'webextension-polyfill'
import {createElement} from 'react'

import '../../../../css/popup/search.css'

const Search = (props) => (
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

Search.propTypes = {
  inputValue: PropTypes.string.isRequired,
  onInput: PropTypes.func.isRequired
}

export default Search
