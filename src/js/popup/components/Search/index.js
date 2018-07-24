// @flow strict @jsx createElement

import debounce from 'lodash.debounce'
import * as R from 'ramda'
import {Fragment, PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

import {normalizeInputtingValue} from '../../../common/utils'
import {bookmarkCreators, uiCreators} from '../../reduxs'
import GlobalKeyboardEventListener from '../GlobalKeyboardEventListener'
import Search from './Search'

const SEARCH_TIMEOUT = 300

type Props = {|
  getSearchResult: (string) => void,
  isFocusSearchInput: boolean,
  setIsFocusSearchInput: (boolean) => void
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

  handleBlur = () => {
    this.props.setIsFocusSearchInput(false)
  }

  handleDocumentKeyDown = (evt: KeyboardEvent) => {
    const isCharKey = evt.key.length === 1
    const notFocusOnInputElement =
      !document.activeElement || !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
    if (notFocusOnInputElement && isCharKey) {
      this.props.setIsFocusSearchInput(true)
    }
  }

  handleFocus = () => {
    this.props.setIsFocusSearchInput(true)
  }

  handleInput = (evt: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      inputValue: normalizeInputtingValue(evt.currentTarget.value)
    })
  }

  render = () => (
    <Fragment>
      <Search
        inputValue={this.state.inputValue}
        isFocus={this.props.isFocusSearchInput}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onInput={this.handleInput}
      />
      <GlobalKeyboardEventListener onKeyDown={this.handleDocumentKeyDown} />
    </Fragment>
  )
}

const mapStateToProps = R.compose(
  R.pick(['isFocusSearchInput']),
  R.prop('ui')
)

const mapDispatchToProps = {
  ...R.pick(['getSearchResult'], bookmarkCreators),
  ...R.pick(['setIsFocusSearchInput'], uiCreators)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchContainer)
