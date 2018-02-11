// @flow

import * as R from 'ramda'
import {connect} from 'react-redux'

import {bookmarkCreators} from '../../reduxs'
import BookmarkTree from './BookmarkTree'

const mapStateToProps = (state, ownProps) => ({
  treeInfo: state.bookmark.trees.find(R.pathEq(['parent', 'id'], ownProps.treeId))
})

const mapDispatchToProps = R.pick(['openBookmarkTree'], bookmarkCreators)

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkTree)
