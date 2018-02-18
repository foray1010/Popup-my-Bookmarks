// @flow
// @jsx createElement

import * as R from 'ramda'
import {PureComponent, createElement} from 'react'
import type {Element} from 'react'
import {connect} from 'react-redux'

import {bookmarkCreators} from '../../reduxs'
import BookmarkTrees from './BookmarkTrees'
import withBookmarkEvents from './withBookmarkEvents'

const getTreeIds = R.compose(R.map(R.path(['parent', 'id'])), R.path(['bookmark', 'trees']))

type Props = {
  initBookmarkTrees: () => void,
  mainTreeHeader: Element<*>,
  options: Object,
  treeIds: string[]
};
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

export default R.compose(withBookmarkEvents, connect(mapStateToProps, mapDispatchToProps))(
  BookmarkTreesContainer
)
