import * as React from 'react'
import {connect} from 'react-redux'

import {OptionsConfig} from '../../../common/types/options'
import {getOptionsConfig} from '../../../common/utils'
import {OPTION_TABLE_MAP} from '../../constants'
import {RootState, optionsCreators} from '../../reduxs'
import OptionForm from './OptionForm'

const mapStateToProps = (state: RootState) => ({
  options: state.options,
  selectedOptionFormMap: OPTION_TABLE_MAP[state.navigation.selectedNavModule]
})

const mapDispatchToProps = {
  saveOptions: optionsCreators.saveOptions,
  resetToDefaultOptions: optionsCreators.resetToDefaultOptions,
  updatePartialOptions: optionsCreators.updatePartialOptions
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
const OptionFormContainer = (props: Props) => {
  const [optionsConfig, setOptionsConfig] = React.useState<OptionsConfig | void>()

  React.useEffect(() => {
    getOptionsConfig()
      .then(setOptionsConfig)
      .catch(console.error)
  }, [])

  if (!optionsConfig) return null

  return (
    <OptionForm
      options={props.options}
      optionsConfig={optionsConfig}
      resetToDefaultOptions={props.resetToDefaultOptions}
      saveOptions={props.saveOptions}
      selectedOptionFormMap={props.selectedOptionFormMap}
      updatePartialOptions={props.updatePartialOptions}
    />
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionFormContainer)
