// @flow
// @jsx createElement

import * as R from 'ramda'
import {Fragment, PureComponent, createElement} from 'react'
import type {ComponentType} from 'react'
import EventListener from 'react-event-listener'
import {connect} from 'react-redux'

import {bookmarkCreators} from '../../reduxs'
import type {BookmarkTree} from '../../types'

const cycle = (start, end, value) => {
  if (value < start) return end
  if (value > end) return start
  return value
}

const getFocusedTreeIndex = (trees, focusId) =>
  trees.findIndex(R.compose(R.any(R.propEq('id', focusId)), R.prop('children')))

const getNextFocusId = (trees, focusId, indexOffset) => {
  const focusedTreeIndex = getFocusedTreeIndex(trees, focusId)
  const focusedTree = trees[focusedTreeIndex]
  if (focusedTree) {
    const focusedChildIndex = focusedTree.children.findIndex(R.propEq('id', focusId))
    if (focusedChildIndex >= 0) {
      const nextIndex = cycle(0, focusedTree.children.length - 1, focusedChildIndex + indexOffset)
      return focusedTree.children[nextIndex].id
    }
  }

  return ''
}

const getNthChildIdOfLastTree = (trees, n): string =>
  R.compose(R.propOr('', 'id'), R.nth(n), R.propOr([], 'children'), R.last)(trees)

const privatePropNames = ['focusId', 'setFocusId', 'trees']
const withKeyboardNav = (WrappedComponent: ComponentType<*>) => {
  type Props = {|
    focusId: string,
    setFocusId: (string) => void,
    trees: $ReadOnlyArray<BookmarkTree>
  |}
  return class KeyboardNav extends PureComponent<Props> {
    handleDocumentArrowVertical = (isDown) => {
      const nextFocusId = this.props.focusId ?
        getNextFocusId(this.props.trees, this.props.focusId, isDown ? 1 : -1) :
        getNthChildIdOfLastTree(this.props.trees, isDown ? 0 : -1)
      this.props.setFocusId(nextFocusId)
    }

    handleDocumentKeyDown = (evt: KeyboardEvent) => {
      switch (evt.key) {
        case 'ArrowDown':
          this.handleDocumentArrowVertical(true)
          break
        case 'ArrowUp':
          this.handleDocumentArrowVertical(false)
          break
        default:
      }
    }

    render = () => (
      <Fragment>
        <WrappedComponent {...R.without(privatePropNames, this.props)} />
        <EventListener target={document} onKeyDown={this.handleDocumentKeyDown} />
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  focusId: state.bookmark.focusId,
  trees: state.bookmark.trees
})

const mapDispatchToProps = R.pick(['setFocusId'], bookmarkCreators)

export default R.compose(connect(mapStateToProps, mapDispatchToProps), withKeyboardNav)
