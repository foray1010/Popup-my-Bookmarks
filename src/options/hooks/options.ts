import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import webExtension from 'webextension-polyfill'

import type { Options } from '@/core/types/options.js'

const queryKey = 'options'

export function useGetOptions() {
  return useQuery({
    queryKey: [queryKey],
    async queryFn(): Promise<Partial<Options>> {
      return webExtension.storage.sync.get()
    },
  })
}

export function useDeleteOptions() {
  const queryClient = useQueryClient()

  return useMutation({
    async mutationFn() {
      return webExtension.storage.sync.clear()
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: [queryKey],
      })
    },
  })
}

export function useUpdateOptions() {
  const queryClient = useQueryClient()

  return useMutation({
    async mutationFn(options: Partial<Options>) {
      return webExtension.storage.sync.set(options)
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: [queryKey],
      })
    },
  })
}
