import debounce from 'lodash.debounce'
import PropTypes from 'prop-types'
import R from 'ramda'
import {createElement, PureComponent} from 'react'

import {getClickType, openBookmark, tryFocusToSearchInput} from '../../functions'

export default (WrappedComponent) => {
  return class extends PureComponent {
    static propTypes = {
      closeMenu: PropTypes.func.isRequired,
      editorTarget: PropTypes.object,
      focusTarget: PropTypes.object,
      isSearching: PropTypes.bool.isRequired,
      menuTarget: PropTypes.object,
      onPressArrowKey: PropTypes.func.isRequired,
      openMenu: PropTypes.func.isRequired,
      options: PropTypes.object.isRequired,
      selectedMenuItem: PropTypes.string,
      trees: PropTypes.arrayOf(PropTypes.object).isRequired
    }

    componentDidMount() {
      document.documentElement.addEventListener('keydown', this.handleKeyDown)
    }

    handleEnter = async (evt) => {
      const {
        focusTarget, isSearching, menuTarget, options, selectedMenuItem, trees
      } = this.props

      if (menuTarget) {
        if (selectedMenuItem) {
          const el = document.getElementById(selectedMenuItem)
          if (el) el.click()
        }
      } else {
        let itemInfo
        if (focusTarget) {
          itemInfo = focusTarget
        } else if (isSearching) {
          itemInfo = trees[0].children[0]
        }

        if (itemInfo) {
          const clickType = getClickType(evt)
          await openBookmark(itemInfo, clickType, options)
        }
      }
    }

    handleKeyDown = async (evt) => {
      const {
        closeMenu, editorTarget, focusTarget, menuTarget, openMenu
      } = this.props

      // no custom handle for editor
      if (editorTarget) return

      const {keyCode} = evt
      switch (keyCode) {
        case 9: // tab
        case 37: // left
        case 38: // up
        case 39: // right
        case 40: {
          // down
          const mapping = R.cond([
            [R.equals(9), R.always(evt.shiftKey ? 'up' : 'down')],
            [R.equals(37), R.always('left')],
            [R.equals(38), R.always('up')],
            [R.equals(39), R.always('right')],
            [R.equals(40), R.always('down')]
          ])

          evt.preventDefault()
          this.keyboardArrowHandler(mapping(keyCode))
          break
        }

        case 13: // enter
          if (evt.repeat) return

          evt.preventDefault()
          this.handleEnter(evt)
          break

        case 17: // ctrl
        case 91: // menu
        case 93: {
          // menu
          if (evt.repeat) return

          const isMac = /^Mac/.test(window.navigator.platform)
          const isMenuKey = [91, 93].includes(keyCode)
          if (isMac === isMenuKey) return

          evt.preventDefault()
          if (menuTarget) {
            closeMenu()
          } else if (focusTarget) {
            openMenu(focusTarget)
          }
          break
        }

        default:
          tryFocusToSearchInput()
      }
    }

    keyboardArrowHandler = debounce(this.props.onPressArrowKey, 30)

    render = () => <WrappedComponent {...this.props} />
  }
}
