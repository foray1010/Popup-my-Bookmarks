import debounce from 'lodash.debounce'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createElement, PureComponent} from 'react'

import FolderCover from './FolderCover'
import {removeTreeInfosFromIndex} from '../../actions'

const mapDispatchToProps = {
  removeTreeInfosFromIndex
}

class FolderCoverContainer extends PureComponent {
  static propTypes = {
    isHidden: PropTypes.bool.isRequired,
    removeTreeInfosFromIndex: PropTypes.func.isRequired,
    treeIndex: PropTypes.number.isRequired
  }

  closeCover = debounce(() => {
    this.props.removeTreeInfosFromIndex(this.props.treeIndex + 1)
  }, 200)

  cancelCloseCover = () => {
    this.closeCover.cancel()
  }

  render = () => (
    <FolderCover
      {...this.props}
      onClick={this.closeCover}
      onMouseLeave={this.cancelCloseCover}
      onMouseMove={this.closeCover}
    />
  )
}

const mapStateToProps = (state, ownProps) => ({
  // hide the folder if it is not the top two folder
  isHidden: state.trees.length - ownProps.treeIndex <= 2
})

export default connect(mapStateToProps, mapDispatchToProps)(FolderCoverContainer)
