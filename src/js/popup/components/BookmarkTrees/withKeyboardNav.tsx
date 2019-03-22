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
  const KeyboardNav = (props: Props) => {
    const {arrowRightNavigate, removeNextBookmarkTrees, setFocusId, trees} = props

    // mutable ref to avoid too many rerender when focusId keeps changing
    const focusIdRef = React.useRef('')
    focusIdRef.current = props.focusId

    const handleDocumentArrowLeft = React.useCallback(() => {
      // at least we need one tree
      if (trees.length > 1) {
        const lastTree = trees[trees.length - 1]
        const secondLastTree = trees[trees.length - 2]

        removeNextBookmarkTrees(secondLastTree.parent.id)

        const nextFocusId = getChildId(secondLastTree, R.find(R.propEq('id', lastTree.parent.id)))
        setFocusId(nextFocusId)
      }
    }, [removeNextBookmarkTrees, setFocusId, trees])

    const handleDocumentArrowRight = React.useCallback(() => {
      const focusedTree = getFocusedTree(trees, focusIdRef.current)
      if (focusedTree) {
        arrowRightNavigate(focusIdRef.current, focusedTree.parent.id)
      }
    }, [arrowRightNavigate, trees])

    const handleDocumentArrowVertical = React.useCallback(
      (isDown: boolean) => {
        const nextFocusId = focusIdRef.current ?
          getNextFocusId(trees, focusIdRef.current, isDown ? 1 : -1) :
          getChildId(trees[trees.length - 1], R.nth(isDown ? 0 : -1))
        setFocusId(nextFocusId)
      },
      [setFocusId, trees]
    )

    const handleDocumentKeyDown = React.useCallback(
      (evt: KeyboardEvent) => {
        switch (evt.key) {
          case 'ArrowDown':
            handleDocumentArrowVertical(true)
            break
          case 'ArrowLeft':
            handleDocumentArrowLeft()
            break
          case 'ArrowRight':
            handleDocumentArrowRight()
            break
          case 'ArrowUp':
            handleDocumentArrowVertical(false)
            break
          case 'Tab':
            handleDocumentArrowVertical(!evt.shiftKey)
            break
          default:
        }
      },
      [handleDocumentArrowLeft, handleDocumentArrowRight, handleDocumentArrowVertical]
    )

    return (
      <React.Fragment>
        <WrappedComponent {...props} />
        <GlobalKeyboardEventListener onKeyDown={handleDocumentKeyDown} />
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
