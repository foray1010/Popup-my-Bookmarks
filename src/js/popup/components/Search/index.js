// @flow strict

import * as React from 'react'
import {connect} from 'react-redux'

import {normalizeInputtingValue} from '../../../common/utils'
import {type RootState, bookmarkCreators, uiCreators} from '../../reduxs'
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
class SearchContainer extends React.PureComponent<Props, State> {
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
    <>
      <Search
        inputValue={this.state.inputValue}
        isFocus={this.props.isFocusSearchInput}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onChange={this.handleInput}
      />
      <GlobalKeyboardEventListener onKeyDown={this.handleDocumentKeyDown} />
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
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
