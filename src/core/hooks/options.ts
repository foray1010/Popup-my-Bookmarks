import { useMutation, useQuery } from 'react-query'
import webExtension from 'webextension-polyfill'

import type { Options } from '../types/options'
import { queryClient } from '../utils/queryClient'

const queryKey = 'options'

export function useGetOptions() {
  return useQuery(
    queryKey,
    (): Promise<Partial<Options>> => webExtension.storage.sync.get(),
  )
}

export function useDeleteOptions() {
  return useMutation(() => webExtension.storage.sync.clear(), {
    async onSuccess() {
      await queryClient.invalidateQueries(queryKey)
    },
  })
}

export function useUpdateOptions() {
  return useMutation(
    (options: Partial<Options>) => webExtension.storage.sync.set(options),
    {
      async onSuccess() {
        await queryClient.invalidateQueries(queryKey)
      },
    },
  )
}
