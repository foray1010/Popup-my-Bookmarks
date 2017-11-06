import debounce from 'lodash.debounce'
import PropTypes from 'prop-types'
import R from 'ramda'
import {createElement, PureComponent} from 'react'

import {getSlicedTrees} from '../../functions'

export default (WrappedComponent) => {
  return class extends PureComponent {
    static propTypes = {
      renewTrees: PropTypes.func.isRequired,
      trees: PropTypes.arrayOf(PropTypes.object).isRequired
    }

    componentDidMount() {
      chrome.bookmarks.onChanged.addListener(this.renewCurrentTrees)
      chrome.bookmarks.onCreated.addListener(this.renewCurrentTrees)
      chrome.bookmarks.onMoved.addListener(this.renewSlicedTreesById)
      chrome.bookmarks.onRemoved.addListener(this.renewSlicedTreesById)
    }

    renewCurrentTrees = () => this.renewTrees(this.props.trees)

    renewSlicedTreesById = (itemId) => {
      const {trees} = this.props

      const removeFromIndex = R.findIndex(R.propEq('id', itemId), trees)

      if (removeFromIndex >= 0) {
        const slicedTrees = getSlicedTrees(trees, removeFromIndex)
        this.renewTrees(slicedTrees)
      } else {
        this.renewCurrentTrees()
      }
    }

    renewTrees = debounce(this.props.renewTrees, 100)

    render = () => <WrappedComponent {...this.props} />
  }
}
