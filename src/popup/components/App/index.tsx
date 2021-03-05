import './globals.css'

import * as React from 'react'

import { ReactQueryClientProvider } from '../../../core/utils/queryClient'
import { OPTIONS } from '../../constants'
import { useOptions, withOptions } from '../../modules/options'
import {
  AbsolutePositionProvider,
  useGlobalBodySize,
} from '../absolutePosition'
import BookmarkTrees from '../BookmarkTrees'
import { Editor, EditorProvider } from '../editor'
import { KeyBindingsProvider } from '../keyBindings'
import { Menu, MenuProvider } from '../menu'
import Search from '../Search'
import useGlobalEvents from './useGlobalEvents'

const AppWithOptions = withOptions(function InnerApp() {
  useGlobalEvents()

  const options = useOptions()

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
})

export default function App() {
  return (
    <ReactQueryClientProvider>
      <KeyBindingsProvider>
        <AbsolutePositionProvider>
          <EditorProvider>
            <MenuProvider>
              <AppWithOptions />
            </MenuProvider>
          </EditorProvider>
        </AbsolutePositionProvider>
      </KeyBindingsProvider>
    </ReactQueryClientProvider>
  )
}
