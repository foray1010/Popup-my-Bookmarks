import './globals.module.css'

import * as React from 'react'

import { ReactQueryClientProvider } from '../../../core/utils/queryClient'
import withProviders from '../../../core/utils/withProviders'
import { OPTIONS } from '../../constants'
import { BookmarkTreesProvider } from '../../modules/bookmarks/contexts/bookmarkTrees'
import { useOptions, withOptions } from '../../modules/options'
import BookmarkTrees from '../BookmarkTrees'
import { ClipboardProvider } from '../clipboard'
import { Editor, EditorProvider } from '../editor'
import { FloatingWindowProvider, useGlobalBodySize } from '../floatingWindow'
import { KeyBindingsProvider } from '../keyBindings'
import { Menu, MenuProvider } from '../menu'
import Search from '../Search'
import useGlobalEvents from './useGlobalEvents'

function useSetBodyCss(bodyCss: Record<string, string | null>) {
  React.useEffect(() => {
    Object.keys(bodyCss).map((key) => {
      document.body.style.setProperty(key, bodyCss[key])
    })
    return () => {
      Object.keys(bodyCss).map((key) => {
        document.body.style.removeProperty(key)
      })
    }
  }, [bodyCss])
}

const AppWithOptions = withOptions(function InnerApp() {
  useGlobalEvents()

  const options = useOptions()

  const { globalBodySize } = useGlobalBodySize()

  const bodyCss = React.useMemo(
    () => ({
      'font-family': Array.from(
        new Set([
          ...(options[OPTIONS.FONT_FAMILY]
            ?.split(',')
            .map((x) => x.trim())
            .filter(Boolean) ?? []),
          'sans-serif',
        ]),
      ).join(','),
      'font-size':
        options[OPTIONS.FONT_SIZE] !== undefined
          ? `${options[OPTIONS.FONT_SIZE]}px`
          : null,
      height:
        globalBodySize?.height !== undefined
          ? `${globalBodySize.height}px`
          : null,
      width:
        globalBodySize?.width !== undefined
          ? `${globalBodySize.width}px`
          : null,
    }),
    [globalBodySize, options],
  )
  useSetBodyCss(bodyCss)

  return (
    <BookmarkTreesProvider>
      <BookmarkTrees mainTreeHeader={<Search />} />
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
