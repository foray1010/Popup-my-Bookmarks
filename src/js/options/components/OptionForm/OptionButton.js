import '../../../../css/options/option-button.css'

import PropTypes from 'prop-types'
import {createElement} from 'react'

const OptionButton = (props) => {
  const {msg, onClick} = props

  return (
    <button styleName='main' type='button' onClick={onClick}>
      {msg}
    </button>
  )
}

OptionButton.propTypes = {
  msg: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default OptionButton
