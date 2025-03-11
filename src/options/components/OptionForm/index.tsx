import { useEffect, useState } from 'react'
import type { ValueOf } from 'type-fest'

import type { OPTIONS } from '../../../core/constants/index.js'
import type { OptionsConfig } from '../../../core/types/options.js'
import getOptionsConfig from '../../../core/utils/getOptionsConfig.js'
import { OPTION_TABLE_MAP } from '../../constants/index.js'
import {
  useDeleteOptions,
  useGetOptions,
  useUpdateOptions,
} from '../../hooks/options.js'
import { useNavigationContext } from '../navigationContext.js'
import OptionForm from './OptionForm.js'

function useGetOptionsWithDefaultValues({
  optionsConfig,
}: Readonly<{ optionsConfig: OptionsConfig | undefined }>) {
  const [isFilledDefaultValues, setIsFilledDefaultValues] = useState(false)

  const { data: options } = useGetOptions()
  const { mutateAsync: setOptions } = useUpdateOptions()

  useEffect(() => {
    if (!options || !optionsConfig) return

    const missingOptionNames = (
      Object.keys(optionsConfig) as readonly ValueOf<typeof OPTIONS>[]
    ).filter((optionName) => options[optionName] === undefined)

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

  const [optionsConfig, setOptionsConfig] = useState<OptionsConfig>()
  useEffect(() => {
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
