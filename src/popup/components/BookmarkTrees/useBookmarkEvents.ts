import debounce from 'lodash.debounce'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import useAction from '../../../core/hooks/useAction'
import { bookmarkCreators } from '../../reduxs'

export default function useBookmarkEvents() {
  const refreshBookmarkTrees = useAction(bookmarkCreators.refreshBookmarkTrees)

  React.useEffect(() => {
    const refreshTrees = debounce(refreshBookmarkTrees, 100)

    webExtension.bookmarks.onChanged.addListener(refreshTrees)
    webExtension.bookmarks.onCreated.addListener(refreshTrees)
    webExtension.bookmarks.onMoved.addListener(refreshTrees)
    webExtension.bookmarks.onRemoved.addListener(refreshTrees)

    return () => {
      webExtension.bookmarks.onChanged.removeListener(refreshTrees)
      webExtension.bookmarks.onCreated.removeListener(refreshTrees)
      webExtension.bookmarks.onMoved.removeListener(refreshTrees)
      webExtension.bookmarks.onRemoved.removeListener(refreshTrees)
    }
  }, [refreshBookmarkTrees])
}
