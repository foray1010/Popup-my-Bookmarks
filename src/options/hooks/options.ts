import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import webExtension from 'webextension-polyfill'

import type { Options } from '../../core/types/options.js'

const queryKey = 'options'

export function useGetOptions() {
  return useQuery(
    [queryKey],
    (): Promise<Partial<Options>> => webExtension.storage.sync.get(),
  )
}

export function useDeleteOptions() {
  const queryClient = useQueryClient()

  return useMutation(() => webExtension.storage.sync.clear(), {
    async onSuccess() {
      await queryClient.invalidateQueries([queryKey])
    },
  })
}

export function useUpdateOptions() {
  const queryClient = useQueryClient()

  return useMutation(
    (options: Partial<Options>) => webExtension.storage.sync.set(options),
    {
      async onSuccess() {
        await queryClient.invalidateQueries([queryKey])
      },
    },
  )
}
