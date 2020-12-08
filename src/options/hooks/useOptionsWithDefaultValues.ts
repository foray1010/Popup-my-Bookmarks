import * as React from 'react'

import type { OPTIONS } from '../../core/constants'
import { useGetOptions, useUpdateOptions } from '../../core/hooks/options'
import type { OptionsConfig } from '../../core/types/options'
import { getOptionsConfig } from '../../core/utils'

export default function useOptionsWithDefaultValues() {
  const [isFilledDefaultValues, setIsFilledDefaultValues] = React.useState(
    false,
  )

  const { data: options } = useGetOptions()

  const [optionsConfig, setOptionsConfig] = React.useState<OptionsConfig>()
  React.useEffect(() => {
    getOptionsConfig().then(setOptionsConfig).catch(console.error)
  }, [])

  const [setOptions] = useUpdateOptions()

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

      setIsFilledDefaultValues(false)
    } else {
      setIsFilledDefaultValues(true)
    }
  }, [options, optionsConfig, setOptions])

  return isFilledDefaultValues ? options : null
}
