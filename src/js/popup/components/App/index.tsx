import * as React from 'react'
import {connect} from 'react-redux'

import {OPTIONS} from '../../constants'
import {RootState} from '../../reduxs'
import KeyBindingsProvider from '../keyBindings/KeyBindingsProvider'
import App from './App'
import useGlobalEvents from './useGlobalEvents'

const mapStateToProps = (state: RootState) => ({
  isShowEditor: Boolean(state.editor.targetId),
  isShowMenu: Boolean(state.menu.targetId),
  options: state.options
})

type Props = ReturnType<typeof mapStateToProps>
const AppContainer = (props: Props) => {
  useGlobalEvents()

  const styles = React.useMemo(
    (): object => ({
      '--fontFamily': [props.options[OPTIONS.FONT_FAMILY], 'sans-serif'].filter(Boolean).join(','),
      '--fontSize': `${props.options[OPTIONS.FONT_SIZE] || 12}px`
    }),
    [props.options]
  )

  return (
    <KeyBindingsProvider>
      <App isShowEditor={props.isShowEditor} isShowMenu={props.isShowMenu} style={styles} />
    </KeyBindingsProvider>
  )
}

export default connect(mapStateToProps)(AppContainer)
