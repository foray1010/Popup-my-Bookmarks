import '../../../../../css/popup/menu-item.css'

import classNames from 'classnames'
import PropTypes from 'prop-types'
import {createElement} from 'react'
import webExtension from 'webextension-polyfill'

const MenuItem = (props) => (
  <div
    styleName={classNames('main', {
      selected: props.isSelected,
      unclickable: props.isUnclickable
    })}
    id={props.menuItemKey}
    onClick={props.onClick}
    onMouseEnter={props.onMouseEnter}
    onMouseLeave={props.onMouseLeave}
  >
    {webExtension.i18n.getMessage(props.menuItemKey)}
  </div>
)

MenuItem.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  isUnclickable: PropTypes.bool.isRequired,
  menuItemKey: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired
}

export default MenuItem
