// @flow strict @jsx createElement

import * as R from 'ramda'
import {Fragment, createElement} from 'react'
import {connect} from 'react-redux'
import {createGlobalStyle} from 'styled-components'

import App from './App'
import withKeyboardEvents from './withKeyboardEvents'
import withMouseEvents from './withMouseEvents'

const GlobalStyles = createGlobalStyle`
  body {
    font-family: ${R.prop('fontFamily')}, sans-serif;
    font-size: ${R.prop('fontSize')}px;
  }
`

type Props = {|
  isShowEditor: boolean,
  isShowMenu: boolean,
  options: Object
|}
const AppContainer = (props: Props) => (
  <Fragment>
    <GlobalStyles fontFamily={props.options.fontFamily} fontSize={props.options.fontSize} />
    <App isShowEditor={props.isShowEditor} isShowMenu={props.isShowMenu} />
  </Fragment>
)

const mapStateToProps = (state) => ({
  isShowEditor: Boolean(state.editor.targetId),
  isShowMenu: Boolean(state.menu.targetId),
  options: state.options
})

export default R.compose(
  withMouseEvents,
  withKeyboardEvents,
  connect(mapStateToProps)
)(AppContainer)
