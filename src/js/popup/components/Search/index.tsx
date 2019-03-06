import * as React from 'react'
import {connect} from 'react-redux'

import {RootState, bookmarkCreators, uiCreators} from '../../reduxs'
import GlobalKeyboardEventListener from '../GlobalKeyboardEventListener'
import Search from './Search'

const mapStateToProps = (state: RootState) => ({
  isFocusSearchInput: state.ui.isFocusSearchInput
})

const mapDispatchToProps = {
  getSearchResult: bookmarkCreators.getSearchResult,
  setIsFocusSearchInput: uiCreators.setIsFocusSearchInput
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
interface State {
  inputValue: string
}
class SearchContainer extends React.PureComponent<Props, State> {
  public state = {
    inputValue: ''
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.inputValue !== prevState.inputValue) {
      this.props.getSearchResult(this.state.inputValue)
    }
  }

  private handleBlur = () => {
    this.props.setIsFocusSearchInput(false)
  }

  private handleDocumentKeyDown = (evt: KeyboardEvent) => {
    const isCharKey = evt.key.length === 1
    const notFocusOnInputElement =
      !document.activeElement || !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
    if (notFocusOnInputElement && isCharKey) {
      this.props.setIsFocusSearchInput(true)
    }
  }

  private handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      inputValue: evt.currentTarget.value
    })
  }

  private handleFocus = () => {
    this.props.setIsFocusSearchInput(true)
  }

  public render = () => (
    <React.Fragment>
      <Search
        inputValue={this.state.inputValue}
        isFocus={this.props.isFocusSearchInput}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onChange={this.handleChange}
      />
      <GlobalKeyboardEventListener onKeyDown={this.handleDocumentKeyDown} />
    </React.Fragment>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchContainer)
