import debounce from 'lodash.debounce'
import PropTypes from 'prop-types'
import webExtension from 'webextension-polyfill'
import {createElement, PureComponent} from 'react'

import '../../../../css/popup/search.css'
import {normalizeInputtingValue} from '../../../common/functions'

class Search extends PureComponent {
  state = {
    inputValue: this.props.searchKeyword
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.inputValue !== prevState.inputValue) {
      this.handleSearchKeywordChange()
    }
  }

  handleInput = (evt) => {
    this.setState({
      inputValue: normalizeInputtingValue(evt.target.value)
    })
  }

  handleSearchKeywordChange = debounce(() => {
    const {updateTreesBySearchKeyword} = this.props

    const newSearchKeyword = this.state.inputValue.trim()

    updateTreesBySearchKeyword(newSearchKeyword)
  }, 300)

  render() {
    return (
      <div styleName='main'>
        <input
          id='search'
          type='search'
          placeholder={webExtension.i18n.getMessage('search')}
          value={this.state.inputValue}
          tabIndex='-1'
          onInput={this.handleInput}
        />
      </div>
    )
  }
}

Search.propTypes = {
  searchKeyword: PropTypes.string.isRequired,
  updateTreesBySearchKeyword: PropTypes.func.isRequired
}

export default Search
