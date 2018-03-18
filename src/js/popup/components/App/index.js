// @flow
// @jsx createElement

import {css} from 'emotion'
import * as R from 'ramda'
import {PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

import App from './App'
import withMouseEvents from './withMouseEvents'

type Props = {|
  isShowEditor: boolean,
  isShowMenu: boolean,
  options: Object
|}
class AppContainer extends PureComponent<Props> {
  componentDidMount() {
    if (document.body) {
      const bodyStyle = css`
        font-family: ${this.props.options.fontFamily}, sans-serif;
        font-size: ${this.props.options.fontSize}px;
      `
      document.body.classList.add(bodyStyle)
    }
  }

  render = () => <App isShowEditor={this.props.isShowEditor} isShowMenu={this.props.isShowMenu} />
}

const mapStateToProps = (state) => ({
  isShowEditor: Boolean(state.editor.targetId),
  isShowMenu: Boolean(state.menu.targetId),
  options: state.options
})

export default R.compose(withMouseEvents, connect(mapStateToProps))(AppContainer)
