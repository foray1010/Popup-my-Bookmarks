// @flow
// @jsx createElement

import * as R from 'ramda'
import {PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

import {setPredefinedStyleSheet} from '../../functions'
import App from './App'
import withMouseEvents from './withMouseEvents'

type Props = {
  options: Object
};
class AppContainer extends PureComponent<Props> {
  componentDidMount() {
    setPredefinedStyleSheet(this.props.options)
  }

  render = () => <App />
}

const mapStateToProps = R.pick(['options'])

export default R.compose(withMouseEvents, connect(mapStateToProps))(AppContainer)
