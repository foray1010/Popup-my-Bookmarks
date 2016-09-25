import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'
import classNames from 'classnames'
import CSSModules from 'react-css-modules'

import {
  reloadOptions,
  selectNavModule
} from '../actions'

import styles from '../../../css/options/nav-bar-item.css'

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

    const thisStyleName = classNames(
      'main',
      {
        'main-active': navBarItemInfo.navModule === selectedNavModule
      }
    )

    return (
      <a
        styleName={thisStyleName}
        href=''
        onClick={this.handleClick}
      >
        {navBarItemInfo.title}
      </a>
    )
  }
}

NavBarItem.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navBarItemInfo: PropTypes.object.isRequired,
  selectedNavModule: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  selectedNavModule: state.selectedNavModule
})

export default connect(mapStateToProps)(
  CSSModules(NavBarItem, styles, {allowMultiple: true})
)
