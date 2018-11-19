// @flow strict @jsx createElement

import * as R from 'ramda'
import {PureComponent, createElement} from 'react'
import type {Node} from 'react'
import {connect} from 'react-redux'

import {type RootState, bookmarkCreators} from '../../reduxs'
import BookmarkTrees from './BookmarkTrees'
import withBookmarkEvents from './withBookmarkEvents'
import withKeyboardNav from './withKeyboardNav'

type Props = {|
  initBookmarkTrees: () => void,
  mainTreeHeader: Node,
  options: Object,
  treeIds: Array<string>
|}
class BookmarkTreesContainer extends PureComponent<Props> {
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
  withKeyboardNav,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(BookmarkTreesContainer)
