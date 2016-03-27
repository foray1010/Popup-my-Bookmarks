import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'

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

const mapStateToProps = (state) => ({
  menuTarget: state.menuTarget,
  mousePosition: state.mousePosition,
  searchKeyword: state.searchKeyword
})

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

    const el = this.base
    const isHidden = !menuTarget

    let bottomPosPx = ''
    let rightPosPx = ''

    if (!isHidden) {
      const body = document.body
      const html = document.getElementsByTagName('html')[0]
      const menuHeight = el.offsetHeight
      const menuWidth = el.offsetWidth

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

    el.style.bottom = bottomPosPx
    el.style.right = rightPosPx
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
          this.base = ref
        }}
        className='menu'
        hidden={isHidden}
      >
        {menuItems}
      </div>
    )
  }
}

if (process.env.NODE_ENV !== 'production') {
  Menu.propTypes = {
    menuTarget: PropTypes.object,
    mousePosition: PropTypes.objectOf(PropTypes.number).isRequired,
    searchKeyword: PropTypes.string.isRequired
  }
}

export default connect(mapStateToProps)(Menu)
