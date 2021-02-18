import './globals.css'

import * as React from 'react'
import { useSelector } from 'react-redux'

import { ReactQueryClientProvider } from '../../../core/utils/queryClient'
import { OPTIONS } from '../../constants'
import type { RootState } from '../../reduxs'
import { AbsolutePositionProvider } from '../absolutePosition/AbsolutePositionContext'
import useGlobalBodySize from '../absolutePosition/useGlobalBodySize'
import BookmarkTrees from '../BookmarkTrees'
import { Editor, EditorProvider } from '../editor'
import { KeyBindingsProvider } from '../keyBindings/KeyBindingsContext'
import { Menu, MenuProvider } from '../menu'
import Search from '../Search'
import useGlobalEvents from './useGlobalEvents'

const AppContainer = () => {
  useGlobalEvents()

  const options = useSelector((state: RootState) => state.options)

  const { globalBodySize } = useGlobalBodySize()

  return (
    <div
      style={React.useMemo(
        () => ({
          fontFamily: [options[OPTIONS.FONT_FAMILY], 'sans-serif']
            .filter(Boolean)
            .join(','),
          fontSize: `${options[OPTIONS.FONT_SIZE] ?? 12}px`,
          height:
            globalBodySize?.height !== undefined
              ? `${globalBodySize.height}px`
              : 'auto',
          width:
            globalBodySize?.width !== undefined
              ? `${globalBodySize.width}px`
              : 'auto',
        }),
        [globalBodySize, options],
      )}
    >
      <BookmarkTrees mainTreeHeader={<Search />} />
      <Menu />
      <Editor />
    </div>
  )
}

const AppContainerWithProviders = () => {
  return (
    <ReactQueryClientProvider>
      <KeyBindingsProvider>
        <AbsolutePositionProvider>
          <EditorProvider>
            <MenuProvider>
              <AppContainer />
            </MenuProvider>
          </EditorProvider>
        </AbsolutePositionProvider>
      </KeyBindingsProvider>
    </ReactQueryClientProvider>
  )
}

export default AppContainerWithProviders
