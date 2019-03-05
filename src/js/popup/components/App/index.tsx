import * as R from 'ramda'
import * as React from 'react'
import {connect} from 'react-redux'
import {createGlobalStyle} from 'styled-components'

import {RootState} from '../../reduxs'
import App from './App'
import withKeyboardEvents from './withKeyboardEvents'
import withMouseEvents from './withMouseEvents'

interface GlobalStylesProps {
  fontFamily?: string
  fontSize?: number
}
const GlobalStyles = createGlobalStyle<GlobalStylesProps>`
  body {
    font-family: ${(props) => [props.fontFamily, 'sans-serif'].filter(Boolean).join(',')};
    font-size: ${R.propOr(12, 'fontSize')}px;
  }
`

const mapStateToProps = (state: RootState) => ({
  isShowEditor: Boolean(state.editor.targetId),
  isShowMenu: Boolean(state.menu.targetId),
  options: state.options
})

type Props = ReturnType<typeof mapStateToProps>
const AppContainer = (props: Props) => (
  <React.Fragment>
    <GlobalStyles fontFamily={props.options.fontFamily} fontSize={props.options.fontSize} />
    <App isShowEditor={props.isShowEditor} isShowMenu={props.isShowMenu} />
  </React.Fragment>
)

export default withMouseEvents(withKeyboardEvents(connect(mapStateToProps)(AppContainer)))
