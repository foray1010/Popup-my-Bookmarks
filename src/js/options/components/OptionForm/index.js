import {connect} from 'react-redux'

import OptionForm from './OptionForm'
import {OPTION_TABLE_MAP} from '../../constants'
import {saveOptions, resetToDefaultOptions, updateSingleOption} from '../../actions'

const mapDispatchToProps = {
  saveOptions,
  resetToDefaultOptions,
  updateSingleOption
}

const mapStateToProps = (state) => ({
  options: state.options,
  optionsConfig: state.optionsConfig,
  selectedOptionFormMap: OPTION_TABLE_MAP[state.selectedNavModule]
})

export default connect(mapStateToProps, mapDispatchToProps)(OptionForm)
