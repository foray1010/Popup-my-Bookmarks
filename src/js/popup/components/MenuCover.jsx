import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import styles from '../../../css/popup/menu-cover.scss'

import {
  resetBodySize
} from '../functions'
import {
  updateEditorTarget,
  updateMenuTarget
} from '../actions'

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

if (process.env.NODE_ENV !== 'production') {
  MenuCover.propTypes = {
    dispatch: PropTypes.func.isRequired,
    isHidden: PropTypes.bool.isRequired
  }
}

const mapStateToProps = (state) => ({
  // if editor or menu has target, show menu-cover
  isHidden: !(state.editorTarget || state.menuTarget)
})

export default connect(mapStateToProps)(
  CSSModules(MenuCover, styles)
)
