import {bind} from 'decko'
import {connect} from 'react-redux'
import {Component, h} from 'preact'

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
  @bind
  clickHandler() {
    const {dispatch} = this.props

    resetBodySize()

    dispatch([
      updateEditorTarget(null),
      updateMenuTarget(null)
    ])
  }

  render(props) {
    const {isHidden} = props

    return (
      <div
        id='menu-cover'
        className='cover'
        hidden={isHidden}
        onClick={this.clickHandler}
      />
    )
  }
}

export default MenuCover
