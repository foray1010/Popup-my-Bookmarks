// @flow strict
// @jsx createElement

import * as R from 'ramda'
import {PureComponent, createElement} from 'react'
import type {Node} from 'react'
import {connect} from 'react-redux'

import {bookmarkCreators} from '../../reduxs'
import BookmarkTrees from './BookmarkTrees'
import withBookmarkEvents from './withBookmarkEvents'
import withKeyboardNav from './withKeyboardNav'

const getTreeIds = R.compose(R.map(R.path(['parent', 'id'])), R.path(['bookmark', 'trees']))

type Props = {|
  initBookmarkTrees: () => void,
  mainTreeHeader: Node,
  options: Object,
  treeIds: $ReadOnlyArray<string>
|}
class BookmarkTreesContainer extends PureComponent<Props> {
  componentDidMount() {
    this.props.initBookmarkTrees()
  }

  render = () => <BookmarkTrees {...this.props} />
}

const mapStateToProps = (state) => ({
  options: state.options,
  treeIds: getTreeIds(state)
})

const mapDispatchToProps = R.pick(['initBookmarkTrees'], bookmarkCreators)

export default R.compose(
  withBookmarkEvents,
  withKeyboardNav,
  connect(mapStateToProps, mapDispatchToProps)
)(BookmarkTreesContainer)
