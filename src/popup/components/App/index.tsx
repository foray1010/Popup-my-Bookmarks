import * as React from 'react'
import { useSelector } from 'react-redux'

import { OPTIONS } from '../../constants'
import type { RootState } from '../../reduxs'
import AbsolutePositionProvider from '../absolutePosition/AbsolutePositionProvider'
import useGlobalBodySize from '../absolutePosition/useGlobalBodySize'
import KeyBindingsProvider from '../keyBindings/KeyBindingsProvider'
import App from './App'
import useGlobalEvents from './useGlobalEvents'

const AppContainer = () => {
  useGlobalEvents()

  const isShowEditor = useSelector((state: RootState) =>
    Boolean(state.editor.targetId),
  )
  const isShowMenu = useSelector((state: RootState) =>
    Boolean(state.menu.targetId),
  )
  const options = useSelector((state: RootState) => state.options)

  const { globalBodySize } = useGlobalBodySize()

  const styles: object = React.useMemo(
    () => ({
      '--fontFamily': [options[OPTIONS.FONT_FAMILY], 'sans-serif']
        .filter(Boolean)
        .join(','),
      '--fontSize': `${options[OPTIONS.FONT_SIZE] ?? 12}px`,
      '--height':
        globalBodySize && globalBodySize.height !== undefined
          ? `${globalBodySize.height}px`
          : 'auto',
      '--width':
        globalBodySize && globalBodySize.width !== undefined
          ? `${globalBodySize.width}px`
          : 'auto',
    }),
    [globalBodySize, options],
  )

  return (
    <App isShowEditor={isShowEditor} isShowMenu={isShowMenu} style={styles} />
  )
}

const AppContainerWithProviders = () => {
  return (
    <AbsolutePositionProvider>
      <KeyBindingsProvider>
        <AppContainer />
      </KeyBindingsProvider>
    </AbsolutePositionProvider>
  )
}

export default AppContainerWithProviders
