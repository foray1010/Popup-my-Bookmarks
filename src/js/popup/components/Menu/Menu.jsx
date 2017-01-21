import {createElement, PropTypes, PureComponent} from 'react'
import {static as Immutable} from 'seamless-immutable'
import CSSModules from 'react-css-modules'

import {
  getBookmarkType,
  isFolder,
  resetBodySize
} from '../../functions'
import * as CST from '../../constants'
import MenuArea from './MenuArea'

import styles from '../../../../css/popup/menu.css'

class Menu extends PureComponent {
  componentDidUpdate(prevProps) {
    const {menuTarget} = this.props

    const isHidden = !menuTarget

    if (menuTarget !== prevProps.menuTarget) {
      this.setMenuPosition()

      if (isHidden) {
        resetBodySize()
      }
    }
  }

  getIsMenuAreasHidden() {
    const {
      isSearching,
      menuTarget
    } = this.props

    switch (getBookmarkType(menuTarget)) {
      case CST.TYPE_ROOT_FOLDER:
        return [false, true, true, true, true]

      case CST.TYPE_BOOKMARK:
        if (isSearching) {
          return [false, false, false, true, true]
        }
        break

      case CST.TYPE_NO_BOOKMARK:
        return [true, true, false, false, true]

      default:
    }

    return [false, false, false, false, false]
  }

  getMenuPattern() {
    const {menuTarget} = this.props

    const partialMenuPattern = [
      [CST.MENU_CUT, CST.MENU_COPY, CST.MENU_PASTE],
      [CST.MENU_ADD_PAGE, CST.MENU_ADD_FOLDER, CST.MENU_ADD_SEPARATOR],
      [CST.MENU_SORT_BY_NAME]
    ]

    if (isFolder(menuTarget)) {
      return Immutable([
        [CST.MENU_OPEN_ALL, CST.MENU_OPEN_ALL_IN_N, CST.MENU_OPEN_ALL_IN_I],
        [CST.MENU_RENAME, CST.MENU_DEL],
        ...partialMenuPattern
      ])
    }

    return Immutable([
      [CST.MENU_OPEN_IN_B, CST.MENU_OPEN_IN_N, CST.MENU_OPEN_IN_I],
      [CST.MENU_EDIT, CST.MENU_DEL],
      ...partialMenuPattern
    ])
  }

  setMenuPosition() {
    const {
      menuTarget,
      mousePosition
    } = this.props

    const isHidden = !menuTarget

    let bottomPosPx = ''
    let rightPosPx = ''

    if (!isHidden) {
      const body = document.body
      const html = document.documentElement
      if (body && html) {
        const bodyWidth = body.offsetWidth
        const htmlHeight = html.clientHeight
        const menuHeight = this.baseEl.offsetHeight
        const menuWidth = this.baseEl.offsetWidth

        if (menuHeight > htmlHeight) {
          body.style.height = menuHeight + 'px'
        }

        if (menuWidth > bodyWidth) {
          body.style.width = menuWidth + 'px'
        }

        const bottomPos = htmlHeight - menuHeight - mousePosition.y
        const rightPos = bodyWidth - menuWidth - mousePosition.x

        bottomPosPx = Math.max(bottomPos, 0) + 'px'
        rightPosPx = Math.max(rightPos, 0) + 'px'
      }
    }

    this.baseEl.style.bottom = bottomPosPx
    this.baseEl.style.right = rightPosPx
  }

  render() {
    const {menuTarget} = this.props

    const isHidden = !menuTarget

    let menuItems = null

    if (menuTarget) {
      const isMenuAreasHidden = this.getIsMenuAreasHidden()
      const menuPattern = this.getMenuPattern()

      menuItems = menuPattern.map((menuAreaKeys, menuAreaIndex) => (
        <MenuArea
          key={menuAreaKeys.join()}
          isHidden={isMenuAreasHidden[menuAreaIndex]}
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
  isSearching: PropTypes.bool.isRequired,
  menuTarget: PropTypes.object,
  mousePosition: PropTypes.objectOf(PropTypes.number).isRequired
}

export default CSSModules(Menu, styles)
