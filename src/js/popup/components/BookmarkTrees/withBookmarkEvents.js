// @flow
// @jsx createElement

import debounce from 'lodash.debounce'
import * as R from 'ramda'
import {PureComponent, createElement} from 'react'
import {connect} from 'react-redux'
import webExtension from 'webextension-polyfill'

import {bookmarkCreators} from '../../reduxs'

const REFRESH_BOOKMARKS_TIMEOUT = 100

const privatePropNames = ['refreshBookmarkTrees']

const withBookmarkEvents = (WrappedComponent) => {
  type Props = {|
    refreshBookmarkTrees: () => void
  |}
  return class BookmarkEvents extends PureComponent<Props> {
    componentDidMount() {
      webExtension.bookmarks.onChanged.addListener(this.refreshTrees)
      webExtension.bookmarks.onCreated.addListener(this.refreshTrees)
      webExtension.bookmarks.onMoved.addListener(this.refreshTrees)
      webExtension.bookmarks.onRemoved.addListener(this.refreshTrees)
    }

    refreshTrees = debounce(this.props.refreshBookmarkTrees, REFRESH_BOOKMARKS_TIMEOUT)

    render = () => <WrappedComponent {...R.omit(privatePropNames, this.props)} />
  }
}

const mapDispatchToProps = R.pick(privatePropNames, bookmarkCreators)

export default R.compose(connect(null, mapDispatchToProps), withBookmarkEvents)
