import debounce from 'lodash.debounce'
import * as React from 'react'
import {connect} from 'react-redux'
import webExtension from 'webextension-polyfill'

import {bookmarkCreators} from '../../reduxs'

export default <P extends {}>(WrappedComponent: React.ComponentType<P>) => {
  const mapDispatchToProps = {
    refreshBookmarkTrees: bookmarkCreators.refreshBookmarkTrees
  }

  type Props = P & typeof mapDispatchToProps
  const BookmarkEvents = (props: Props) => {
    const {refreshBookmarkTrees} = props

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

    return <WrappedComponent {...props} />
  }

  return connect(
    null,
    mapDispatchToProps
  )(
    // @ts-ignore
    BookmarkEvents
  )
}
