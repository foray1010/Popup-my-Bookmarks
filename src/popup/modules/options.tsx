import { useQuery } from '@tanstack/react-query'
import constate from 'constate'
import type { ComponentType } from 'react'
import webExtension from 'webextension-polyfill'

import type { Options } from '../../core/types/options.js'
import withProviders from '../../core/utils/withProviders.js'

const queryKey = 'options'

export async function getOptions() {
  return (await webExtension.storage.sync.get()) as unknown as Options
}

const [OptionsProvider, useInternalOptions] = constate(
  function useOptionsState() {
    const { data: options } = useQuery({
      queryKey: [queryKey],
      queryFn: getOptions,
    })

    return options
  },
)

export function withOptions<P extends {}>(
  // eslint-disable-next-line functional/prefer-immutable-types
  WrappedComponent: ComponentType<P>,
) {
  function InnerComponent(props: P) {
    const options = useInternalOptions()
    if (!options) return null

    return <WrappedComponent {...props} />
  }

  return withProviders<P>(InnerComponent, [OptionsProvider])
}

export function useOptions() {
  const options = useInternalOptions()
  if (!options) {
    throw new Error('options not found')
  }

  return options
}
