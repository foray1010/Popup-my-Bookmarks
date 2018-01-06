import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createElement, PureComponent} from 'react'

import TreeHeader from './TreeHeader'
import {removeTreeInfosFromIndex} from '../../../actions'

const mapDispatchToProps = {
  removeTreeInfosFromIndex
}

class TreeHeaderContainer extends PureComponent {
  static propTypes = {
    isHidden: PropTypes.bool.isRequired,
    removeTreeInfosFromIndex: PropTypes.func.isRequired,
    treeIndex: PropTypes.number.isRequired,
    treeInfo: PropTypes.object.isRequired
  }

  handleClose = () => {
    this.props.removeTreeInfosFromIndex(this.props.treeIndex)
  }

  render = () => <TreeHeader {...this.props} onClose={this.handleClose} />
}

const mapStateToProps = (state, ownProps) => ({
  isHidden: Boolean(ownProps.treeIndex === 0 || state.searchKeyword),
  treeInfo: state.trees[ownProps.treeIndex]
})

export default connect(mapStateToProps, mapDispatchToProps)(TreeHeaderContainer)
