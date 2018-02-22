// @flow
// @jsx createElement

import {css} from 'emotion'
import * as R from 'ramda'
import {PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

import App from './App'
import withMouseEvents from './withMouseEvents'

type Props = {|
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

  render = () => <App />
}

const mapStateToProps = R.pick(['options'])

export default R.compose(withMouseEvents, connect(mapStateToProps))(AppContainer)
