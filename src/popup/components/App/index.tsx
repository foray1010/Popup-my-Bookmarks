import './globals.module.css'

import type { PropertiesHyphen } from 'csstype'
import * as React from 'react'

import { ReactQueryClientProvider } from '../../../core/utils/queryClient.js'
import withProviders from '../../../core/utils/withProviders.js'
import { OPTIONS } from '../../constants/index.js'
import { BookmarkTreesProvider } from '../../modules/bookmarks/contexts/bookmarkTrees.js'
import { useOptions, withOptions } from '../../modules/options.js'
import BookmarkTrees from '../BookmarkTrees/index.js'
import { ClipboardProvider } from '../clipboard/index.js'
import { Editor, EditorProvider } from '../editor/index.js'
import {
  FloatingWindowProvider,
  useGlobalBodySize,
} from '../floatingWindow/index.js'
import { KeyBindingsProvider } from '../keyBindings/index.js'
import { LastPositionsProvider } from '../lastPositions/index.js'
import { Menu, MenuProvider } from '../menu/index.js'
import Search from '../Search/index.js'
import useGlobalEvents from './useGlobalEvents.js'

function useRootCss(key: keyof PropertiesHyphen, value: string | null) {
  React.useEffect(() => {
    document.documentElement.style.setProperty(key, value)

    return () => {
      document.documentElement.style.removeProperty(key)
    }
  }, [key, value])
}

const AppWithOptions = withOptions(function InnerApp() {
  useGlobalEvents()

  const options = useOptions()

  const { globalBodySize } = useGlobalBodySize()

  useRootCss(
    'font-family',
    Array.from(
      new Set([
        ...options[OPTIONS.FONT_FAMILY]
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean),
        'system-ui',
        'sans-serif',
      ]),
    ).join(','),
  )
  useRootCss(
    'font-size',
    // revert the 75% font size in body
    `${options[OPTIONS.FONT_SIZE] / 0.75}px`,
  )

  useRootCss(
    'height',
    globalBodySize?.height !== undefined ? `${globalBodySize.height}px` : null,
  )
  useRootCss(
    'width',
    globalBodySize?.width !== undefined ? `${globalBodySize.width}px` : null,
  )

  return (
    <BookmarkTreesProvider>
      <LastPositionsProvider isEnabled={options[OPTIONS.REMEMBER_POS]}>
        <BookmarkTrees firstTreeHeader={<Search />} />
      </LastPositionsProvider>
      <Menu />
      <Editor />
    </BookmarkTreesProvider>
  )
})

const App = withProviders(AppWithOptions, [
  ReactQueryClientProvider,
  ClipboardProvider,
  KeyBindingsProvider,
  FloatingWindowProvider,
  EditorProvider,
  MenuProvider,
])
export default App
