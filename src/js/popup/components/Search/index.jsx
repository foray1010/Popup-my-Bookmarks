import debounce from 'lodash.debounce'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createElement, PureComponent} from 'react'

import Search from './Search'
import {normalizeInputtingValue} from '../../../common/functions'
import {updateTreesBySearchKeyword} from '../../actions'

const mapDispatchToProps = {
  updateTreesBySearchKeyword
}

class SearchContainer extends PureComponent {
  static propTypes = {
    searchKeyword: PropTypes.string.isRequired,
    updateTreesBySearchKeyword: PropTypes.func.isRequired
  }

  state = {
    inputValue: this.props.searchKeyword
  }

  handleInput = (evt) => {
    const newInputValue = normalizeInputtingValue(evt.target.value)

    if (this.state.inputValue !== newInputValue) {
      this.setState({
        inputValue: newInputValue
      })

      this.handleSearchKeywordChange()
    }
  }

  handleSearchKeywordChange = debounce(() => {
    const newSearchKeyword = this.state.inputValue.trim()

    this.props.updateTreesBySearchKeyword(newSearchKeyword)
  }, 300)

  render = () => (
    <Search {...this.props} inputValue={this.state.inputValue} onInput={this.handleInput} />
  )
}

const mapStateToProps = (state) => ({
  searchKeyword: state.searchKeyword
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer)
