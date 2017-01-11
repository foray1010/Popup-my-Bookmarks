import {createElement, PropTypes, PureComponent} from 'react'
import CSSModules from 'react-css-modules'

import Editor from '../Editor'
import Menu from '../Menu'
import MenuCover from '../MenuCover'
import Panel from '../Panel'

import styles from '../../../../css/popup/app.css'

class Main extends PureComponent {
  render() {
    const {
      onContextMenu,
      onKeyDown,
      onMouseDown
    } = this.props

    return (
      <div
        styleName='main'
        onContextMenu={onContextMenu}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
      >
        <Panel />
        <MenuCover />
        <Menu />
        <Editor />
      </div>
    )
  }
}

Main.propTypes = {
  onContextMenu: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired
}

export default CSSModules(Main, styles)
