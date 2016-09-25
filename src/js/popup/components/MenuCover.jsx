import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import {
  resetBodySize
} from '../functions'
import {
  updateEditorTarget,
  updateMenuTarget
} from '../actions'

import styles from '../../../css/popup/menu-cover.css'

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
        styleName='main'
        hidden={isHidden}
        onClick={this.handleClick}
      />
    )
  }
}

MenuCover.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isHidden: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
  // if editor or menu has target, show menu-cover
  isHidden: !(state.editorTarget || state.menuTarget)
})

export default connect(mapStateToProps)(
  CSSModules(MenuCover, styles)
)
