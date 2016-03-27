import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'

import {
  resetBodySize
} from '../functions'
import {
  updateEditorTarget,
  updateMenuTarget
} from '../actions'

const mapStateToProps = (state) => ({
  // if editor or menu has target, show menu-cover
  isHidden: !(state.editorTarget || state.menuTarget)
})

class MenuCover extends Component {
  @autobind
  handleClick() {
    const {dispatch} = this.props

    resetBodySize()

    dispatch([
      updateEditorTarget(null),
      updateMenuTarget(null)
    ])
  }

  render() {
    const {isHidden} = this.props

    return (
      <div
        id='menu-cover'
        className='cover'
        hidden={isHidden}
        onClick={this.handleClick}
      />
    )
  }
}

if (process.env.NODE_ENV !== 'production') {
  MenuCover.propTypes = {
    dispatch: PropTypes.func.isRequired,
    isHidden: PropTypes.bool.isRequired
  }
}

export default connect(mapStateToProps)(MenuCover)
