import PropTypes from 'prop-types'
import R from 'ramda'
import {PureComponent, createElement} from 'react'
import {connect} from 'react-redux'
import Immutable from 'seamless-immutable'
import store from 'store'

import {genBookmarkList, updateLastScrollTopList} from '../../functions'
import BookmarkItem from './BookmarkItem'
import BookmarkTree from './BookmarkTree'
import DragIndicator from './DragIndicator'
import NoResult from './NoResult'

class BookmarkTreeContainer extends PureComponent {
  static propTypes = {
    dragIndicator: PropTypes.object,
    isRememberLastPosition: PropTypes.bool.isRequired,
    isSearching: PropTypes.bool.isRequired,
    rootTree: PropTypes.object.isRequired,
    treeIndex: PropTypes.number.isRequired,
    treeInfo: PropTypes.object.isRequired
  }

  getTreeItems() {
    const {
      dragIndicator, isSearching, rootTree, treeIndex, treeInfo
    } = this.props

    const bookmarkList = genBookmarkList(treeInfo, {
      isSearching,
      rootTree,
      treeIndex
    })

    const treeItems = bookmarkList.map((itemInfo) => (
      <BookmarkItem key={itemInfo.id} itemInfo={itemInfo} treeIndex={treeIndex} />
    ))

    if (isSearching && treeItems.length === 0) {
      return treeItems.concat(<NoResult />)
    }

    if (dragIndicator && dragIndicator.parentId === treeInfo.id) {
      let dragIndicatorIndex = dragIndicator.index

      const isFirstTree = treeIndex === 0
      if (isFirstTree && !isSearching) {
        dragIndicatorIndex += rootTree.children.length
      }

      return Immutable(R.insert(dragIndicatorIndex, <DragIndicator />, treeItems))
    }
    return treeItems
  }

  handleScroll = ({scrollTop}) => {
    if (this.props.isRememberLastPosition) {
      updateLastScrollTopList(this.props.treeIndex, scrollTop || 0)
    }
  }

  render = () => (
    <BookmarkTree {...this.props} treeItems={this.getTreeItems()} onScroll={this.handleScroll} />
  )
}

const mapStateToProps = (state, ownProps) => {
  const {
    dragIndicator, focusTarget, itemOffsetHeight, options, rootTree
  } = state

  const isSearching = Boolean(state.searchKeyword)
  const treeInfo = state.trees[ownProps.treeIndex]

  const isRememberLastPosition = options.rememberPos && !isSearching

  let scrollToIndex = -1
  if (focusTarget) {
    let compiledChildrenInfo = treeInfo.children

    const isFirstTree = ownProps.treeIndex === 0
    if (isFirstTree && !isSearching) {
      compiledChildrenInfo = rootTree.children.concat(compiledChildrenInfo)
    }

    scrollToIndex = compiledChildrenInfo.findIndex((itemInfo) => itemInfo.id === focusTarget.id)
  }

  return {
    dragIndicator,
    isRememberLastPosition,
    isSearching,
    itemOffsetHeight,
    lastScrollTop: isRememberLastPosition ?
      R.prop(ownProps.treeIndex, store.get('lastScrollTop')) :
      undefined,
    listItemWidth: options.setWidth,
    rootTree,
    scrollToIndex,
    treeInfo
  }
}

export default connect(mapStateToProps)(BookmarkTreeContainer)
