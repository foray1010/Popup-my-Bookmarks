import * as React from 'react'
import { useSelector } from 'react-redux'

import useAction from '../../../core/hooks/useAction'
import { OptionsConfig } from '../../../core/types/options'
import { getOptionsConfig } from '../../../core/utils'
import { OPTION_TABLE_MAP } from '../../constants'
import { optionsCreators, RootState } from '../../reduxs'
import OptionForm from './OptionForm'

const OptionFormContainer = () => {
  const [
    optionsConfig,
    setOptionsConfig,
  ] = React.useState<OptionsConfig | void>()

  const options = useSelector((state: RootState) => state.options)
  const selectedOptionFormMap = useSelector(
    (state: RootState) => OPTION_TABLE_MAP[state.navigation.selectedNavModule],
  )

  const resetToDefaultOptions = useAction(optionsCreators.resetToDefaultOptions)
  const saveOptions = useAction(optionsCreators.saveOptions)
  const updatePartialOptions = useAction(optionsCreators.updatePartialOptions)

  React.useEffect(() => {
    getOptionsConfig().then(setOptionsConfig).catch(console.error)
  }, [])

  if (!optionsConfig) return null

  return (
    <OptionForm
      options={options}
      optionsConfig={optionsConfig}
      resetToDefaultOptions={resetToDefaultOptions}
      saveOptions={saveOptions}
      selectedOptionFormMap={selectedOptionFormMap}
      updatePartialOptions={updatePartialOptions}
    />
  )
}

export default OptionFormContainer
