import debounce from 'lodash.debounce'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import useAction from '../../../common/hooks/useAction'
import {bookmarkCreators} from '../../reduxs'

const useBookmarkEvents = () => {
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

export default useBookmarkEvents
