import './globals.module.css'

import { useDeepCompareEffect } from 'use-deep-compare'

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
import { Menu, MenuProvider } from '../menu/index.js'
import Search from '../Search/index.js'
import useGlobalEvents from './useGlobalEvents.js'

function useRootCss(rootCss: Record<string, string | null>) {
  useDeepCompareEffect(() => {
    Object.entries(rootCss).map(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
    return () => {
      Object.keys(rootCss).map((key) => {
        document.documentElement.style.removeProperty(key)
      })
    }
  }, [rootCss])
}

const AppWithOptions = withOptions(function InnerApp() {
  useGlobalEvents()

  const options = useOptions()

  const { globalBodySize } = useGlobalBodySize()

  useRootCss({
    'font-family': Array.from(
      new Set([
        ...(options[OPTIONS.FONT_FAMILY]
          ?.split(',')
          .map((x) => x.trim())
          .filter(Boolean) ?? []),
        'system-ui',
        'sans-serif',
      ]),
    ).join(','),
    'font-size':
      options[OPTIONS.FONT_SIZE] !== undefined
        ? // revert the 75% font size in body
          `${options[OPTIONS.FONT_SIZE] / 0.75}px`
        : null,
  })

  // as this part will update frequently, so use another useRootCss to avoid resetting all styles
  useRootCss({
    height:
      globalBodySize?.height !== undefined
        ? `${globalBodySize.height}px`
        : null,
    width:
      globalBodySize?.width !== undefined ? `${globalBodySize.width}px` : null,
  })

  return (
    <BookmarkTreesProvider>
      <BookmarkTrees firstTreeHeader={<Search />} />
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
