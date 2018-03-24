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

const getFocusedTree = (trees, focusId) =>
  trees.find(R.compose(R.any(R.propEq('id', focusId)), R.prop('children')))

const getNextFocusId = (trees, focusId, indexOffset) => {
  const focusedTree = getFocusedTree(trees, focusId)
  if (focusedTree) {
    const focusedChildIndex = focusedTree.children.findIndex(R.propEq('id', focusId))
    if (focusedChildIndex >= 0) {
      const nextIndex = cycle(0, focusedTree.children.length - 1, focusedChildIndex + indexOffset)
      return focusedTree.children[nextIndex].id
    }
  }

  return ''
}

const getNthChildId = (trees, n) =>
  R.compose(R.propOr('', 'id'), R.nth(n), R.propOr([], 'children'))(trees)

const privatePropNames = [
  'arrowRightNavigate',
  'focusId',
  'removeBookmarkTrees',
  'setFocusId',
  'trees'
]
const withKeyboardNav = (WrappedComponent: ComponentType<*>) => {
  type Props = {|
    arrowRightNavigate: (string, string) => void,
    focusId: string,
    removeBookmarkTrees: (string) => void,
    setFocusId: (string) => void,
    trees: $ReadOnlyArray<BookmarkTree>
  |}
  return class KeyboardNav extends PureComponent<Props> {
    handleDocumentArrowLeft = () => {
      const {trees} = this.props

      // at least we need one tree
      if (trees.length > 1) {
        const secondLastTree = trees[trees.length - 2]
        this.props.removeBookmarkTrees(secondLastTree.parent.id)

        const nextFocusId = getNthChildId(secondLastTree, 0)
        this.props.setFocusId(nextFocusId)
      }
    }

    handleDocumentArrowRight = () => {
      const focusedTree = getFocusedTree(this.props.trees, this.props.focusId)
      if (focusedTree) {
        this.props.arrowRightNavigate(this.props.focusId, focusedTree.parent.id)
      }
    }

    handleDocumentArrowVertical = (isDown) => {
      const {focusId, trees} = this.props

      const nextFocusId = focusId ?
        getNextFocusId(trees, focusId, isDown ? 1 : -1) :
        getNthChildId(trees[trees.length - 1], isDown ? 0 : -1)
      this.props.setFocusId(nextFocusId)
    }

    handleDocumentKeyDown = (evt: KeyboardEvent) => {
      switch (evt.key) {
        case 'ArrowDown':
          this.handleDocumentArrowVertical(true)
          break
        case 'ArrowLeft':
          this.handleDocumentArrowLeft()
          break
        case 'ArrowRight':
          this.handleDocumentArrowRight()
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

const mapDispatchToProps = R.pick(
  ['arrowRightNavigate', 'removeBookmarkTrees', 'setFocusId'],
  bookmarkCreators
)

export default R.compose(connect(mapStateToProps, mapDispatchToProps), withKeyboardNav)
