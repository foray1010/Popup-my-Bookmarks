import { act, renderHook, waitFor } from '@testing-library/react'

import { ReactQueryClientProvider } from '../../../core/utils/queryClient.js'
import {
  useDeleteOptions,
  useGetOptions,
  useUpdateOptions,
} from '../options.js'

describe('options hooks', () => {
  async function initTestData() {
    const { result: useDeleteOptionsResult } = renderHook(useDeleteOptions, {
      wrapper: ReactQueryClientProvider,
    })
    const { mutateAsync: deleteOptions } = useDeleteOptionsResult.current
    await act(async () => {
      await deleteOptions()
    })

    const { result: useUpdateOptionsResult } = renderHook(useUpdateOptions, {
      wrapper: ReactQueryClientProvider,
    })
    const { mutateAsync: updateOptions } = useUpdateOptionsResult.current
    await act(async () => {
      await updateOptions({ rememberPos: true })
    })
  }

  describe('useGetOptions', () => {
    it('should get options', async () => {
      await initTestData()

      const { result } = renderHook(useGetOptions, {
        wrapper: ReactQueryClientProvider,
      })

      await waitFor(() => expect(result.current.isFetching).toBe(false))

      expect(result.current.data).toStrictEqual({ rememberPos: true })
    })
  })

  describe('useDeleteOptions', () => {
    it('should delete all options and refetch in useGetOptions', async () => {
      await initTestData()

      const { result: useGetOptionsResult } = renderHook(useGetOptions, {
        wrapper: ReactQueryClientProvider,
      })

      await waitFor(() => {
        expect(useGetOptionsResult.current.isFetching).toBe(false)
      })

      expect(useGetOptionsResult.current.data).toHaveProperty('rememberPos')

      const { result: useDeleteOptionsResult } = renderHook(useDeleteOptions, {
        wrapper: ReactQueryClientProvider,
      })
      const { mutateAsync: deleteOptions } = useDeleteOptionsResult.current
      await act(async () => {
        await deleteOptions()
      })

      await waitFor(() => {
        expect(useGetOptionsResult.current.data).toStrictEqual({})
      })
    })
  })

  describe('useUpdateOptions', () => {
    it('should insert option and refetch in useGetOptions', async () => {
      await initTestData()

      const { result: useGetOptionsResult } = renderHook(useGetOptions, {
        wrapper: ReactQueryClientProvider,
      })

      await waitFor(() => {
        expect(useGetOptionsResult.current.isFetching).toBe(false)
      })

      expect(useGetOptionsResult.current.data).toHaveProperty('rememberPos')
      expect(useGetOptionsResult.current.data).not.toHaveProperty('tooltip')

      const { result: useUpdateOptionsResult } = renderHook(useUpdateOptions, {
        wrapper: ReactQueryClientProvider,
      })
      const { mutateAsync: updateOptions } = useUpdateOptionsResult.current
      await act(async () => {
        await updateOptions({ tooltip: true })
      })

      await waitFor(() => {
        expect(useGetOptionsResult.current.data).toStrictEqual({
          rememberPos: true,
          tooltip: true,
        })
      })
    })
  })
})
