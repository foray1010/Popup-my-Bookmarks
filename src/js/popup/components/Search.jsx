import {autobind, debounce} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, PropTypes, PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import {
  getSearchResult,
  initTrees
} from '../functions'
import {
  updateSearchKeyword,
  updateTrees
} from '../actions'

import styles from '../../../css/popup/search.css'

const msgSearch = chrome.i18n.getMessage('search')

class Search extends PureComponent {
  constructor(...args) {
    super(...args)

    this.state = {
      inputValue: this.props.searchKeyword
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      isMenuCoverHidden
    } = this.props

    if (isMenuCoverHidden !== prevProps.isMenuCoverHidden) {
      this.tryFocusToInput()
    }

    if (this.state.inputValue !== prevState.inputValue) {
      this.updateTreesBySearchKeyword()
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
      inputValue: this.inputEl.value.trimLeft()
    })
  }

  tryFocusToInput() {
    const {
      isMenuCoverHidden
    } = this.props

    if (isMenuCoverHidden) {
      this.inputEl.focus()
    }
  }

  @debounce(300)
  async updateTreesBySearchKeyword() {
    const {
      dispatch,
      options
    } = this.props

    const newSearchKeyword = this.state.inputValue.trim().replace(/\s+/g, ' ')

    let newTrees
    if (newSearchKeyword === '') {
      newTrees = await initTrees(options)
    } else {
      const searchResult = await getSearchResult(newSearchKeyword, options)

      newTrees = [searchResult]
    }

    dispatch([
      updateSearchKeyword(newSearchKeyword),
      updateTrees(newTrees)
    ])
  }

  render() {
    return (
      <header styleName='main'>
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
      </header>
    )
  }
}

Search.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isMenuCoverHidden: PropTypes.bool.isRequired,
  options: PropTypes.object.isRequired,
  searchKeyword: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  isMenuCoverHidden: !(state.editorTarget || state.menuTarget),
  options: state.options,
  searchKeyword: state.searchKeyword
})

export default connect(mapStateToProps)(
  CSSModules(Search, styles)
)
