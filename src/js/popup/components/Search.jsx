import {autobind, debounce} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import {
  getFirstTree,
  getSearchResult
} from '../functions'
import {
  updateSearchKeyword,
  updateTrees
} from '../actions'

import styles from '../../../css/popup/search.scss'

const msgSearch = chrome.i18n.getMessage('search')

class Search extends Component {
  @autobind
  handleInput(evt) {
    evt.persist()

    this._handleInput(evt)
  }

  @debounce(200)
  async _handleInput(evt) {
    const {
      dispatch,
      options
    } = this.props

    const newSearchKeyword = evt.target.value.trim().replace(/\s+/g, ' ')
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

  render() {
    return (
      <header styleName='main'>
        <input
          type='search'
          placeholder={msgSearch}
          tabIndex='-1'
          autoFocus
          onInput={this.handleInput}
        />
      </header>
    )
  }
}

if (process.env.NODE_ENV !== 'production') {
  Search.propTypes = {
    dispatch: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired
  }
}

const mapStateToProps = (state) => ({
  options: state.options
})

export default connect(mapStateToProps)(
  CSSModules(Search, styles)
)
