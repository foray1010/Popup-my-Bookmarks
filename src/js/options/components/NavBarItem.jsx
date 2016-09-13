import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'
import classNames from 'classnames'

import {
  reloadOptions,
  selectNavModule
} from '../actions'

class NavBarItem extends Component {
  @autobind
  async handleClick(evt) {
    evt.persist()
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

if (process.env.NODE_ENV !== 'production') {
  NavBarItem.propTypes = {
    dispatch: PropTypes.func.isRequired,
    navBarItemInfo: PropTypes.object.isRequired,
    selectedNavModule: PropTypes.string.isRequired
  }
}

const mapStateToProps = (state) => ({
  selectedNavModule: state.selectedNavModule
})

export default connect(mapStateToProps)(NavBarItem)
