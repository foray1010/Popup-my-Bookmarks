import debounce from 'lodash.debounce'
import * as React from 'react'
import {connect} from 'react-redux'
import webExtension from 'webextension-polyfill'

import {bookmarkCreators} from '../../reduxs'

const REFRESH_BOOKMARKS_TIMEOUT = 100

export default <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const mapDispatchToProps = {
    refreshBookmarkTrees: bookmarkCreators.refreshBookmarkTrees
  }

  type Props = P & typeof mapDispatchToProps
  class BookmarkEvents extends React.PureComponent<Props> {
    public componentDidMount() {
      webExtension.bookmarks.onChanged.addListener(this.refreshTrees)
      webExtension.bookmarks.onCreated.addListener(this.refreshTrees)
      webExtension.bookmarks.onMoved.addListener(this.refreshTrees)
      webExtension.bookmarks.onRemoved.addListener(this.refreshTrees)
    }

    private refreshTrees = debounce(this.props.refreshBookmarkTrees, REFRESH_BOOKMARKS_TIMEOUT)

    public render = () => <WrappedComponent {...this.props} />
  }

  return connect(
    null,
    mapDispatchToProps
  )(
    // @ts-ignore
    BookmarkEvents
  )
}
