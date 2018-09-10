// @flow strict @jsx createElement

import {Fragment, PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

import {normalizeInputtingValue} from '../../../common/utils'
import {bookmarkCreators, uiCreators} from '../../reduxs'
import GlobalKeyboardEventListener from '../GlobalKeyboardEventListener'
import Search from './Search'

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
      this.props.getSearchResult(this.state.inputValue)
    }
  }

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

const mapStateToProps = (state) => ({
  isFocusSearchInput: state.ui.isFocusSearchInput
})

const mapDispatchToProps = {
  getSearchResult: bookmarkCreators.getSearchResult,
  setIsFocusSearchInput: uiCreators.setIsFocusSearchInput
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchContainer)
