// @flow strict @jsx createElement

import * as R from 'ramda'
import {Fragment, PureComponent, createElement} from 'react'
import type {ComponentType} from 'react'
import {connect} from 'react-redux'

import {type RootState, bookmarkCreators} from '../../reduxs'
import type {BookmarkTree} from '../../types'
import GlobalKeyboardEventListener from '../GlobalKeyboardEventListener'

const cycle = (start, end, value) => {
  if (value < start) return end
  if (value > end) return start
  return value
}

const getChildId = (trees, childSelector) => {
  const children = trees.children || []
  const child = childSelector(children)
  return child == null ? '' : child.id
}

const getFocusedTree = (trees, focusId) =>
  trees.find(
    R.compose(
      R.any(R.propEq('id', focusId)),
      R.prop('children')
    )
  )

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

const privatePropNames = [
  'arrowRightNavigate',
  'focusId',
  'removeNextBookmarkTrees',
  'setFocusId',
  'trees'
]
const withKeyboardNav = (WrappedComponent: ComponentType<any>) => {
  type Props = {
    arrowRightNavigate: (string, string) => void,
    focusId: string,
    removeNextBookmarkTrees: (string) => void,
    setFocusId: (string) => void,
    trees: Array<BookmarkTree>
  }
  return class KeyboardNav extends PureComponent<Props> {
    handleDocumentArrowLeft = () => {
      const {trees} = this.props

      // at least we need one tree
      if (trees.length > 1) {
        const lastTree = trees[trees.length - 1]
        const secondLastTree = trees[trees.length - 2]

        this.props.removeNextBookmarkTrees(secondLastTree.parent.id)

        const nextFocusId = getChildId(secondLastTree, R.find(R.propEq('id', lastTree.parent.id)))
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
        getChildId(trees[trees.length - 1], R.nth(isDown ? 0 : -1))
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
        case 'Tab':
          this.handleDocumentArrowVertical(!evt.shiftKey)
          break
        default:
      }
    }

    render = () => (
      <Fragment>
        <WrappedComponent {...R.omit(privatePropNames, this.props)} />
        <GlobalKeyboardEventListener onKeyDown={this.handleDocumentKeyDown} />
      </Fragment>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  focusId: state.bookmark.focusId,
  trees: state.bookmark.trees
})

const mapDispatchToProps = {
  arrowRightNavigate: bookmarkCreators.arrowRightNavigate,
  removeNextBookmarkTrees: bookmarkCreators.removeNextBookmarkTrees,
  setFocusId: bookmarkCreators.setFocusId
}

export default R.compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withKeyboardNav
)
