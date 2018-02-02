import '../../../../css/popup/search.css'

import PropTypes from 'prop-types'
import {createElement} from 'react'
import webExtension from 'webextension-polyfill'

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
