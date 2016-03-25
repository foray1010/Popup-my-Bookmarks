import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component} from 'react'

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

@connect(mapStateToProps)
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

export default MenuCover
