import {autobind, debounce} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'

import {
  getFirstTree,
  getSearchResult
} from '../functions'
import {
  updateSearchKeyword,
  updateTrees
} from '../actions'

const msgSearch = chrome.i18n.getMessage('search')

const mapStateToProps = (state) => ({
  options: state.options
})

class Search extends Component {
  constructor() {
    super()

    this.getSearchResult = getSearchResult.bind(this)
  }

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
      const searchResult = await this.getSearchResult(newSearchKeyword)

      newTrees.push(searchResult)
    }

    dispatch([
      updateSearchKeyword(newSearchKeyword),
      updateTrees(newTrees)
    ])
  }

  render() {
    return (
      <div id='search-box'>
        <input
          id='search-input'
          type='search'
          placeholder={msgSearch}
          tabIndex='-1'
          autoFocus
          onInput={this.handleInput}
        />
      </div>
    )
  }
}

if (process.env.NODE_ENV !== 'production') {
  Search.propTypes = {
    dispatch: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired
  }
}

export default connect(mapStateToProps)(Search)
