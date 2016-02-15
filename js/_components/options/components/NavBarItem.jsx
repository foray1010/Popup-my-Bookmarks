import {bind} from 'decko'
import {connect} from 'react-redux'
import {Component, h} from 'preact'

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

    const navBarItemClasses = ['nav-bar-item']

    if (navBarItemInfo.navModule === selectedNavModule) {
      navBarItemClasses.push('nav-bar-item-active')
    }

    return (
      <a
        className={navBarItemClasses.join(' ')}
        href=''
        onClick={this.clickHandler}
      >
        {navBarItemInfo.title}
      </a>
    )
  }
}

export default NavBarItem
