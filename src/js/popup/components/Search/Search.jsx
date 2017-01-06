import {autobind, debounce} from 'core-decorators'
import {createElement, PropTypes, PureComponent} from 'react'
import {static as Immutable} from 'seamless-immutable'
import CSSModules from 'react-css-modules'

import {
  normalizeInputtingValue
} from '../../../common/functions'

import styles from '../../../../css/popup/search.css'

const msgSearch = chrome.i18n.getMessage('search')

class Search extends PureComponent {
  constructor(...args) {
    super(...args)

    this.state = Immutable({
      inputValue: this.props.searchKeyword
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      isMenuCoverHidden
    } = this.props

    if (isMenuCoverHidden !== prevProps.isMenuCoverHidden) {
      this.tryFocusToInput()
    }

    if (this.state.inputValue !== prevState.inputValue) {
      this.handleSearchKeywordChange()
    }
  }

  @autobind
  @debounce(1000) // not sure about it, use timeout because blur fire before props update
  handleBlur() {
    this.tryFocusToInput()
  }

  @autobind
  handleInput() {
    this.setState({
      inputValue: normalizeInputtingValue(this.inputEl.value)
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

  tryFocusToInput() {
    const {
      isMenuCoverHidden
    } = this.props

    if (isMenuCoverHidden) {
      this.inputEl.focus()
    }
  }

  render() {
    return (
      <div styleName='main'>
        <input
          ref={(ref) => {
            this.inputEl = ref
          }}
          type='search'
          placeholder={msgSearch}
          value={this.state.inputValue}
          tabIndex='-1'
          autoFocus
          onBlur={this.handleBlur}
          onInput={this.handleInput}
        />
      </div>
    )
  }
}

Search.propTypes = {
  isMenuCoverHidden: PropTypes.bool.isRequired,
  searchKeyword: PropTypes.string.isRequired,
  updateTreesBySearchKeyword: PropTypes.func.isRequired
}

export default CSSModules(Search, styles)
