import {connect} from 'react-redux'
import {createElement, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import Option from './Option'

import styles from '../../../../../css/options/select-button.css'

const SelectButton = (props) => {
  const {
    optionName,
    options
  } = props

  const optionItems = [true, false].map((optionChoice) => (
    <Option
      key={String(optionChoice)}
      optionChoice={optionChoice}
      optionName={optionName}
    />
  ))
  const optionValue = options[optionName]

  const selectdButtonIndex = optionValue ? 0 : 1

  const selectButtonCoverStyle = {
    left: `${selectdButtonIndex * 50}%`
  }

  return (
    <div styleName='main'>
      <div styleName='cover' style={selectButtonCoverStyle} />
      {optionItems}
    </div>
  )
}

SelectButton.propTypes = {
  optionName: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  options: state.options
})

export default connect(mapStateToProps)(
  CSSModules(SelectButton, styles)
)
