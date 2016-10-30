import {autobind, debounce} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, PropTypes, PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import {
  getFirstTree,
  getSearchResult
} from '../functions'
import {
  updateSearchKeyword,
  updateTrees
} from '../actions'

import styles from '../../../css/popup/search.css'

const msgSearch = chrome.i18n.getMessage('search')

class Search extends PureComponent {
  componentDidUpdate(prevProps) {
    const {
      isMenuCoverHidden
    } = this.props

    if (isMenuCoverHidden !== prevProps.isMenuCoverHidden) {
      this.tryFocusToInput()
    }
  }

  @autobind
  @debounce(1000) // not sure about it, use timeout because blur fire before props update
  handleBlur() {
    this.tryFocusToInput()
  }

  @autobind
  @debounce(200)
  async handleInput() {
    const {
      dispatch,
      options
    } = this.props

    const newSearchKeyword = this.inputEl.value.trim().replace(/\s+/g, ' ')
    const newTrees = []

    if (newSearchKeyword === '') {
      const defExpandTree = await getFirstTree(options)

      newTrees.push(defExpandTree)
    } else {
      const searchResult = await getSearchResult(newSearchKeyword, options)

      newTrees.push(searchResult)
    }

    dispatch([
      updateSearchKeyword(newSearchKeyword),
      updateTrees(newTrees)
    ])
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
      <header styleName='main'>
        <input
          ref={(ref) => {
            this.inputEl = ref
          }}
          type='search'
          placeholder={msgSearch}
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
  options: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  isMenuCoverHidden: !(state.editorTarget || state.menuTarget),
  options: state.options
})

export default connect(mapStateToProps)(
  CSSModules(Search, styles)
)
