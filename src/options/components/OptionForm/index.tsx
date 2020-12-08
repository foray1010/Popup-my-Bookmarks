import * as React from 'react'

import { useDeleteOptions, useUpdateOptions } from '../../../core/hooks/options'
import type { OptionsConfig } from '../../../core/types/options'
import { getOptionsConfig } from '../../../core/utils'
import { OPTION_TABLE_MAP } from '../../constants'
import useOptionsWithDefaultValues from '../../hooks/useOptionsWithDefaultValues'
import { useNavigationContext } from '../navigationContext'
import OptionForm from './OptionForm'

const OptionFormContainer = () => {
  const { currentPath } = useNavigationContext()

  const options = useOptionsWithDefaultValues()

  const [deleteOptions] = useDeleteOptions()
  const [updateOptions] = useUpdateOptions()

  const [optionsConfig, setOptionsConfig] = React.useState<OptionsConfig>()
  React.useEffect(() => {
    getOptionsConfig().then(setOptionsConfig).catch(console.error)
  }, [])

  if (!options || !optionsConfig) return null

  return (
    <OptionForm
      defaultValues={options}
      optionsConfig={optionsConfig}
      selectedOptionFormMap={OPTION_TABLE_MAP[currentPath]}
      onReset={deleteOptions}
      onSubmit={updateOptions}
    />
  )
}

export default OptionFormContainer
