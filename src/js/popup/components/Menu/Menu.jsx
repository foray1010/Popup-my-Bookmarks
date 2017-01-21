import {createElement, PropTypes, PureComponent} from 'react'
import {static as Immutable} from 'seamless-immutable'
import CSSModules from 'react-css-modules'

import {
  getBookmarkType,
  isFolder,
  resetBodySize
} from '../../functions'
import {
  TYPE_BOOKMARK,
  TYPE_NO_BOOKMARK,
  TYPE_ROOT_FOLDER
} from '../../constants'
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
      case TYPE_ROOT_FOLDER:
        return [false, true, true, true, true]

      case TYPE_BOOKMARK:
        if (isSearching) {
          return [false, false, false, true, true]
        }
        break

      case TYPE_NO_BOOKMARK:
        return [true, true, false, false, true]

      default:
    }

    return [false, false, false, false, false]
  }

  getMenuPattern() {
    const {menuTarget} = this.props

    const partialMenuPattern = [
      ['cut', 'copy', 'paste'],
      ['addPage', 'addFolder', 'addSeparator'],
      ['sortByName']
    ]

    if (isFolder(menuTarget)) {
      return Immutable([
        ['openAll', 'openAllInN', 'openAllInI'],
        ['rename', 'del'],
        ...partialMenuPattern
      ])
    }

    return Immutable([
      ['openInB', 'openInN', 'openInI'],
      ['edit', 'del'],
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
