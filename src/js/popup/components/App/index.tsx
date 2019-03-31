import * as R from 'ramda'
import * as React from 'react'
import {connect} from 'react-redux'
import {createGlobalStyle} from 'styled-components'

import {OPTIONS} from '../../constants'
import {RootState} from '../../reduxs'
import App from './App'
import useGlobalEvents from './useGlobalEvents'

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
const AppContainer = (props: Props) => {
  useGlobalEvents()

  return (
    <React.Fragment>
      <GlobalStyles
        fontFamily={props.options[OPTIONS.FONT_FAMILY]}
        fontSize={props.options[OPTIONS.FONT_SIZE]}
      />
      <App isShowEditor={props.isShowEditor} isShowMenu={props.isShowMenu} />
    </React.Fragment>
  )
}

export default connect(mapStateToProps)(AppContainer)
