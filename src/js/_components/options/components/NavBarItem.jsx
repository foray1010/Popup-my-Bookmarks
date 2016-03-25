import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component} from 'react'
import classNames from 'classnames'

import {
  reloadOptions,
  selectNavModule
} from '../actions'

const mapStateToProps = (state) => ({
  selectedNavModule: state.selectedNavModule
})

@connect(mapStateToProps)
class NavBarItem extends Component {
  @autobind
  async handleClick(evt) {
    evt.preventDefault()
    evt.persist()

    const {
      dispatch,
      navBarItemInfo,
      selectedNavModule
    } = this.props

    if (navBarItemInfo.navModule !== selectedNavModule) {
      dispatch([
        await reloadOptions(), // reset the options
        selectNavModule(navBarItemInfo.navModule)
      ])
    }
  }

  render() {
    const {
      navBarItemInfo,
      selectedNavModule
    } = this.props

    const navBarItemClassName = classNames(
      'nav-bar-item',
      {
        'nav-bar-item-active': navBarItemInfo.navModule === selectedNavModule
      }
    )

    return (
      <a
        className={navBarItemClassName}
        href=''
        onClick={this.handleClick}
      >
        {navBarItemInfo.title}
      </a>
    )
  }
}

export default NavBarItem
