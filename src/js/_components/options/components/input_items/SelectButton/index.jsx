import {connect} from 'react-redux'
import {createElement, PropTypes} from 'react'

import Option from './Option'

const mapStateToProps = (state) => ({
  options: state.options
})

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
    <div className='select-button-box'>
      <div className='select-button-cover' style={selectButtonCoverStyle} />
      {optionItems}
    </div>
  )
}

if (process.env.NODE_ENV !== 'production') {
  SelectButton.propTypes = {
    optionName: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired
  }
}

export default connect(mapStateToProps)(SelectButton)
