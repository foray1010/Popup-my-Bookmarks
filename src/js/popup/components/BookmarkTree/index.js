// @flow
// @jsx createElement

import * as R from 'ramda'
import {PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

import {bookmarkCreators} from '../../reduxs'
import BookmarkTree from './BookmarkTree'

type Props = {|
  focusId: string,
  listItemWidth: number,
  removeFocusId: () => void,
  setFocusId: (string) => void,
  treeInfo: Object
|}
class BookmarkTreeContainer extends PureComponent<Props> {
  handleMouseEnter = (bookmarkId: string) => () => {
    this.props.setFocusId(bookmarkId)
  }

  handleMouseLeave = () => {
    this.props.removeFocusId()
  }

  render = () => (
    <BookmarkTree
      focusId={this.props.focusId}
      listItemWidth={this.props.listItemWidth}
      onMouseEnter={this.handleMouseEnter}
      onMouseLeave={this.handleMouseLeave}
      treeInfo={this.props.treeInfo}
    />
  )
}

const mapStateToProps = (state, ownProps) => ({
  focusId: R.path(['bookmark', 'focusId'], state),
  listItemWidth: state.options.setWidth,
  treeInfo: state.bookmark.trees.find(R.pathEq(['parent', 'id'], ownProps.treeId))
})

const mapDispatchToProps = R.pick(
  ['openBookmarkTree', 'removeFocusId', 'setFocusId'],
  bookmarkCreators
)

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkTreeContainer)
