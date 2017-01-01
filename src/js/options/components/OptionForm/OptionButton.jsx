import {createElement, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import styles from '../../../../css/options/option-button.css'

const OptionButton = (props) => {
  const {
    msg,
    onClick
  } = props

  return (
    <button
      styleName='main'
      type='button'
      onClick={onClick}
    >
      {msg}
    </button>
  )
}

OptionButton.propTypes = {
  msg: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default CSSModules(OptionButton, styles)
