// @flow strict

import * as R from 'ramda'
import * as React from 'react'
import {connect} from 'react-redux'
import {createGlobalStyle} from 'styled-components'

import type {Options} from '../../../common/types/options'
import type {RootState} from '../../reduxs'
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
  options: Options
|}
const AppContainer = (props: Props) => (
  <>
    <GlobalStyles fontFamily={props.options.fontFamily} fontSize={props.options.fontSize} />
    <App isShowEditor={props.isShowEditor} isShowMenu={props.isShowMenu} />
  </>
)

const mapStateToProps = (state: RootState) => ({
  isShowEditor: Boolean(state.editor.targetId),
  isShowMenu: Boolean(state.menu.targetId),
  options: state.options
})

export default R.compose(
  withMouseEvents,
  withKeyboardEvents,
  connect(mapStateToProps)
)(AppContainer)
