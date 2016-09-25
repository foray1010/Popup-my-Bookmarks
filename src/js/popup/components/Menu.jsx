import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import {
  getBookmarkType,
  isFolder
} from '../functions'
import {
  TYPE_BOOKMARK,
  TYPE_NO_BOOKMARK,
  TYPE_ROOT_FOLDER
} from '../constants'
import MenuArea from './MenuArea'

import styles from '../../../css/popup/menu.css'

class Menu extends Component {
  componentDidUpdate() {
    this.setMenuPosition()
  }

  getChildrenHiddenStatus() {
    const {
      menuTarget,
      searchKeyword
    } = this.props

    let childrenHiddenStatus = [false, false, false, false, false]

    switch (getBookmarkType(menuTarget)) {
      case TYPE_ROOT_FOLDER:
        childrenHiddenStatus = [false, true, true, true, true]
        break

      case TYPE_BOOKMARK:
        if (searchKeyword) {
          childrenHiddenStatus = [false, false, false, true, true]
        }

        break

      case TYPE_NO_BOOKMARK:
        childrenHiddenStatus = [true, true, false, false, true]
        break

      default:
    }

    return childrenHiddenStatus
  }

  setMenuPosition() {
    const {
      menuTarget,
      mousePosition
    } = this.props

    const {baseEl} = this
    const isHidden = !menuTarget

    let bottomPosPx = ''
    let rightPosPx = ''

    if (!isHidden) {
      const body = document.body
      const html = document.documentElement
      const menuHeight = baseEl.offsetHeight
      const menuWidth = baseEl.offsetWidth

      const bodyWidth = body.offsetWidth
      const htmlHeight = html.clientHeight

      const bottomPos = htmlHeight - menuHeight - mousePosition.y
      const rightPos = bodyWidth - menuWidth - mousePosition.x

      if (menuHeight > htmlHeight) {
        body.style.height = menuHeight + 'px'
      }

      if (menuWidth > bodyWidth) {
        body.style.width = menuWidth + 'px'
      }

      bottomPosPx = Math.max(bottomPos, 0) + 'px'
      rightPosPx = Math.max(rightPos, 0) + 'px'
    }

    baseEl.style.bottom = bottomPosPx
    baseEl.style.right = rightPosPx
  }

  render() {
    const {menuTarget} = this.props

    const isHidden = !menuTarget

    let menuItems = null

    if (menuTarget) {
      const childrenHiddenStatus = this.getChildrenHiddenStatus()
      const menuPattern = [
        [],
        [],
        ['cut', 'copy', 'paste'],
        ['addPage', 'addFolder', 'addSeparator'],
        ['sortByName']
      ]

      if (isFolder(menuTarget)) {
        menuPattern[0].push('openAll', 'openAllInN', 'openAllInI')
        menuPattern[1].push('rename', 'del')
      } else {
        menuPattern[0].push('openInB', 'openInN', 'openInI')
        menuPattern[1].push('edit', 'del')
      }

      menuItems = menuPattern.map((menuAreaKeys, menuAreaIndex) => (
        <MenuArea
          key={menuAreaKeys.join()}
          isHidden={childrenHiddenStatus[menuAreaIndex]}
          menuAreaKeys={menuAreaKeys}
        />
      ))
    }

    return (
      <div
        ref={(ref) => {
          this.baseEl = ref
        }}
        styleName='main'
        hidden={isHidden}
      >
        {menuItems}
      </div>
    )
  }
}

Menu.propTypes = {
  menuTarget: PropTypes.object,
  mousePosition: PropTypes.objectOf(PropTypes.number).isRequired,
  searchKeyword: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  menuTarget: state.menuTarget,
  mousePosition: state.mousePosition,
  searchKeyword: state.searchKeyword
})

export default connect(mapStateToProps)(
  CSSModules(Menu, styles)
)
