// @flow
// @jsx createElement

import * as R from 'ramda'
import {PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

import * as CST from '../../constants'
import {bookmarkCreators} from '../../reduxs'
import type {BookmarkTree as BookmarkTreeType} from '../../types'
import BookmarkTree from './BookmarkTree'

type Props = {|
  focusId: string,
  iconSize: number,
  listItemWidth: number,
  removeFocusId: () => void,
  rowHeight: number,
  setFocusId: (string) => void,
  treeInfo: BookmarkTreeType
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
      iconSize={this.props.iconSize}
      listItemWidth={this.props.listItemWidth}
      onMouseEnter={this.handleMouseEnter}
      onMouseLeave={this.handleMouseLeave}
      rowHeight={this.props.rowHeight}
      treeInfo={this.props.treeInfo}
    />
  )
}

const getIconSize = R.max(CST.MIN_BOOKMARK_ICON_SIZE)
const getRowHeight = (fontSize) =>
  getIconSize(fontSize) +
  // +1 for border width, GOLDEN_GAP for padding
  (1 + CST.GOLDEN_GAP) * 2

const mapStateToProps = (state, ownProps) => ({
  focusId: R.path(['bookmark', 'focusId'], state),
  iconSize: getIconSize(state.options.fontSize),
  listItemWidth: state.options.setWidth,
  rowHeight: getRowHeight(state.options.fontSize),
  treeInfo: state.bookmark.trees.find(R.pathEq(['parent', 'id'], ownProps.treeId))
})

const mapDispatchToProps = R.pick(
  ['openBookmarkTree', 'removeFocusId', 'setFocusId'],
  bookmarkCreators
)

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkTreeContainer)
