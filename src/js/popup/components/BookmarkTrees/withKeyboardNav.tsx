import * as R from 'ramda'
import * as React from 'react'
import {connect} from 'react-redux'

import {RootState, bookmarkCreators} from '../../reduxs'
import {BookmarkInfo, BookmarkTree} from '../../types'
import GlobalKeyboardEventListener from '../GlobalKeyboardEventListener'

const cycle = (start: number, end: number, value: number) => {
  if (value < start) return end
  if (value > end) return start
  return value
}

const getChildId = (
  tree: BookmarkTree,
  childSelector: (children: Array<BookmarkInfo>) => BookmarkInfo | void
) => {
  const children = tree.children || []
  const child = childSelector(children)
  return child !== undefined ? child.id : ''
}

const getFocusedTree = (trees: Array<BookmarkTree>, focusId: string) =>
  trees.find(
    R.compose(
      R.any(R.propEq('id', focusId)),
      R.prop('children')
    )
  )

const getNextFocusId = (trees: Array<BookmarkTree>, focusId: string, indexOffset: number) => {
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

export default <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const mapStateToProps = (state: RootState) => ({
    focusId: state.bookmark.focusId,
    trees: state.bookmark.trees
  })

  const mapDispatchToProps = {
    arrowRightNavigate: bookmarkCreators.arrowRightNavigate,
    removeNextBookmarkTrees: bookmarkCreators.removeNextBookmarkTrees,
    setFocusId: bookmarkCreators.setFocusId
  }

  type Props = P & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
  class KeyboardNav extends React.PureComponent<Props> {
    private handleDocumentArrowLeft = () => {
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

    private handleDocumentArrowRight = () => {
      const focusedTree = getFocusedTree(this.props.trees, this.props.focusId)
      if (focusedTree) {
        this.props.arrowRightNavigate(this.props.focusId, focusedTree.parent.id)
      }
    }

    private handleDocumentArrowVertical = (isDown: boolean) => {
      const {focusId, trees} = this.props

      const nextFocusId = focusId ?
        getNextFocusId(trees, focusId, isDown ? 1 : -1) :
        getChildId(trees[trees.length - 1], R.nth(isDown ? 0 : -1))
      this.props.setFocusId(nextFocusId)
    }

    private handleDocumentKeyDown = (evt: KeyboardEvent) => {
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

    public render = () => (
      <React.Fragment>
        <WrappedComponent {...this.props} />
        <GlobalKeyboardEventListener onKeyDown={this.handleDocumentKeyDown} />
      </React.Fragment>
    )
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    // @ts-ignore
    KeyboardNav
  )
}
