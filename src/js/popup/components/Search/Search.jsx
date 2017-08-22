import {createElement, PureComponent} from 'react'
import _debounce from 'lodash/debounce'
import PropTypes from 'prop-types'

import {
  normalizeInputtingValue
} from '../../../common/functions'

import '../../../../css/popup/search.css'

const msgSearch = chrome.i18n.getMessage('search')

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

  handleSearchKeywordChange = _debounce(() => {
    const {
      updateTreesBySearchKeyword
    } = this.props

    const newSearchKeyword = this.state.inputValue.trim()

    updateTreesBySearchKeyword(newSearchKeyword)
  }, 300)

  render() {
    return (
      <div styleName='main'>
        <input
          id='search'
          type='search'
          placeholder={msgSearch}
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
