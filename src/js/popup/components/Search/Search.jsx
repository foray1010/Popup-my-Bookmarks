import {autobind, debounce} from 'core-decorators'
import {createElement, PureComponent} from 'react'
import PropTypes from 'prop-types'

import {
  normalizeInputtingValue
} from '../../../common/functions'

import '../../../../css/popup/search.css'

const msgSearch = chrome.i18n.getMessage('search')

class Search extends PureComponent {
  constructor(...args) {
    super(...args)

    this.state = {
      inputValue: this.props.searchKeyword
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.inputValue !== prevState.inputValue) {
      this.handleSearchKeywordChange()
    }
  }

  @autobind
  handleInput(evt) {
    this.setState({
      inputValue: normalizeInputtingValue(evt.target.value)
    })
  }

  @debounce(300)
  handleSearchKeywordChange() {
    const {
      updateTreesBySearchKeyword
    } = this.props

    const newSearchKeyword = this.state.inputValue.trim()

    updateTreesBySearchKeyword(newSearchKeyword)
  }

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
