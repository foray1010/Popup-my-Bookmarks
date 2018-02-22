// @flow
// @jsx createElement

import debounce from 'lodash.debounce'
import * as R from 'ramda'
import {PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

import {normalizeInputtingValue} from '../../../common/functions'
import {bookmarkCreators} from '../../reduxs'
import Search from './Search'

const SEARCH_TIMEOUT = 300

type Props = {|
  getSearchResult: (string) => void
|}
type State = {|
  inputValue: string
|}
class SearchContainer extends PureComponent<Props, State> {
  state = {
    inputValue: ''
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.inputValue !== prevState.inputValue) {
      this.getSearchResult()
    }
  }

  getSearchResult = debounce(() => {
    this.props.getSearchResult(this.state.inputValue.trim())
  }, SEARCH_TIMEOUT)

  handleInput = (evt: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      inputValue: normalizeInputtingValue(evt.currentTarget.value)
    })
  }

  render = () => <Search inputValue={this.state.inputValue} onInput={this.handleInput} />
}

const mapDispatchToProps = R.pick(['getSearchResult'], bookmarkCreators)

export default connect(null, mapDispatchToProps)(SearchContainer)
