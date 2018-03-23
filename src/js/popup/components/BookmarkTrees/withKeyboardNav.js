// @flow
// @jsx createElement

import * as R from 'ramda'
import {Fragment, PureComponent, createElement} from 'react'
import EventListener from 'react-event-listener'
import {connect} from 'react-redux'

import {bookmarkCreators} from '../../reduxs'
import type {BookmarkTree} from '../../types'

const cycle = (start, end, value) => {
  if (value < start) return end
  if (value > end) return start
  return value
}

const privatePropNames = ['focusId', 'setFocusId', 'trees']
const withKeyboardNav = (WrappedComponent) => {
  type Props = {|
    focusId: string,
    setFocusId: (string) => void,
    trees: $ReadOnlyArray<BookmarkTree>
  |}
  return class KeyboardNav extends PureComponent<Props> {
    getNextFocusId = (isDown) => {
      const equalFocusId = R.propEq('id', this.props.focusId)

      const focusedTree = this.props.trees.find(R.compose(R.any(equalFocusId), R.prop('children')))
      if (focusedTree) {
        const focusedChildIndex = focusedTree.children.findIndex(equalFocusId)
        if (focusedChildIndex >= 0) {
          const nextIndex = cycle(
            0,
            focusedTree.children.length - 1,
            focusedChildIndex + (isDown ? 1 : -1)
          )
          return focusedTree.children[nextIndex].id
        }
      }

      return ''
    }

    getNthChildIdOfLastTree = (n): string =>
      R.compose(R.propOr('', 'id'), R.nth(n), R.propOr([], 'children'), R.last)(this.props.trees)

    handleDocumentArrowVertical = (isDown) => {
      const nextFocusId = this.props.focusId ?
        this.getNextFocusId(isDown) :
        this.getNthChildIdOfLastTree(isDown ? 0 : -1)
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
