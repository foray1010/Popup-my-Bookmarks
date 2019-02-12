// @flow strict

import * as R from 'ramda'
import * as React from 'react'
import {connect} from 'react-redux'

import {type RootState, bookmarkCreators} from '../../reduxs'
import BookmarkTrees from './BookmarkTrees'
import withBookmarkEvents from './withBookmarkEvents'
import withDragAndDropEvents from './withDragAndDropEvents'
import withKeyboardNav from './withKeyboardNav'

type Props = {|
  initBookmarkTrees: () => void,
  mainTreeHeader: React.Node,
  options: Object,
  treeIds: Array<string>
|}
class BookmarkTreesContainer extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.initBookmarkTrees()
  }

  render = () => <BookmarkTrees {...this.props} />
}

const getTreeIds = (state: RootState): Array<string> =>
  state.bookmark.trees.map((tree) => tree.parent.id)

const mapStateToProps = (state: RootState) => ({
  options: state.options,
  treeIds: getTreeIds(state)
})

const mapDispatchToProps = {
  initBookmarkTrees: bookmarkCreators.initBookmarkTrees
}

export default R.compose(
  withBookmarkEvents,
  withDragAndDropEvents,
  withKeyboardNav,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(BookmarkTreesContainer)
