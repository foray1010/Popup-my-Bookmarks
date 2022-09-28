import * as React from 'react'

import type { OPTIONS } from '../../../core/constants'
import type { OptionsConfig } from '../../../core/types/options'
import { getOptionsConfig } from '../../../core/utils'
import { OPTION_TABLE_MAP } from '../../constants'
import {
  useDeleteOptions,
  useGetOptions,
  useUpdateOptions,
} from '../../hooks/options'
import { useNavigationContext } from '../navigationContext'
import OptionForm from './OptionForm'

function useGetOptionsWithDefaultValues({
  optionsConfig,
}: {
  readonly optionsConfig?: OptionsConfig
}) {
  const [isFilledDefaultValues, setIsFilledDefaultValues] =
    React.useState(false)

  const { data: options } = useGetOptions()
  const { mutateAsync: setOptions } = useUpdateOptions()

  React.useEffect(() => {
    if (!options || !optionsConfig) return

    const missingOptionNames = (Object.keys(optionsConfig) as OPTIONS[]).filter(
      (optionName) => options[optionName] === undefined,
    )

    if (missingOptionNames.length > 0) {
      const missingOptions = Object.fromEntries(
        missingOptionNames.map((optionName) => [
          optionName,
          optionsConfig[optionName].default,
        ]),
      )
      setOptions(missingOptions).catch(console.error)
    } else {
      setIsFilledDefaultValues(true)
    }

    return () => {
      setIsFilledDefaultValues(false)
    }
  }, [options, optionsConfig, setOptions])

  return isFilledDefaultValues ? options : null
}

export default function OptionFormContainer() {
  const { currentPath } = useNavigationContext()

  const [optionsConfig, setOptionsConfig] = React.useState<OptionsConfig>()
  React.useEffect(() => {
    getOptionsConfig().then(setOptionsConfig).catch(console.error)
  }, [])

  const options = useGetOptionsWithDefaultValues({ optionsConfig })

  const { mutateAsync: deleteOptions } = useDeleteOptions()
  const { mutateAsync: updateOptions } = useUpdateOptions()

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
