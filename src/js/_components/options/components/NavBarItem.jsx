import {bind} from 'decko'
import {connect} from 'react-redux'
import {Component, h} from 'preact'
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
  @bind
  async clickHandler(evt) {
    evt.preventDefault()

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

  render(props) {
    const {
      navBarItemInfo,
      selectedNavModule
    } = props

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
        onClick={this.clickHandler}
      >
        {navBarItemInfo.title}
      </a>
    )
  }
}

export default NavBarItem
