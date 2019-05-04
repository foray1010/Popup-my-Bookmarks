import * as React from 'react'
import {connect} from 'react-redux'

import {OPTIONS} from '../../constants'
import {RootState} from '../../reduxs'
import AbsolutePositionProvider from '../absolutePosition/AbsolutePositionProvider'
import useGlobalBodySize from '../absolutePosition/useGlobalBodySize'
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

  const {globalBodySize} = useGlobalBodySize()

  const styles = React.useMemo(
    (): object => ({
      '--fontFamily': [props.options[OPTIONS.FONT_FAMILY], 'sans-serif'].filter(Boolean).join(','),
      '--fontSize': `${props.options[OPTIONS.FONT_SIZE] || 12}px`,
      '--height':
        globalBodySize && globalBodySize.height !== undefined ?
          `${globalBodySize.height}px` :
          'auto',
      '--width':
        globalBodySize && globalBodySize.width !== undefined ? `${globalBodySize.width}px` : 'auto'
    }),
    [globalBodySize, props.options]
  )

  return <App isShowEditor={props.isShowEditor} isShowMenu={props.isShowMenu} style={styles} />
}

export default connect(mapStateToProps)((props: Props) => {
  return (
    <AbsolutePositionProvider>
      <KeyBindingsProvider>
        <AppContainer {...props} />
      </KeyBindingsProvider>
    </AbsolutePositionProvider>
  )
})
