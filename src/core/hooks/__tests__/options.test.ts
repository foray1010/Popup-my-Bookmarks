import { act, renderHook } from '@testing-library/react-hooks'
import { queryCache } from 'react-query'

import { useDeleteOptions, useGetOptions, useUpdateOptions } from '../options'

describe('options hooks', () => {
  beforeEach(async () => {
    const { result: useDeleteOptionsResult } = renderHook(() =>
      useDeleteOptions(),
    )
    const [deleteOptions] = useDeleteOptionsResult.current
    await act(async () => {
      await deleteOptions()
    })

    const { result: useUpdateOptionsResult } = renderHook(() =>
      useUpdateOptions(),
    )
    const [updateOptions] = useUpdateOptionsResult.current
    await act(async () => {
      await updateOptions({ rememberPos: true })
    })
  })

  afterAll(() => {
    queryCache.clear()
  })

  describe('useGetOptions', () => {
    it('should get options', async () => {
      const { result, waitFor } = renderHook(() => useGetOptions())

      await waitFor(() => expect(result.current.isFetching).toBe(false))

      expect(result.current.data).toStrictEqual({ rememberPos: true })
    })
  })

  describe('useDeleteOptions', () => {
    it('should delete all options and refetch in useGetOptions', async () => {
      const { result: useGetOptionsResult, waitFor } = renderHook(() =>
        useGetOptions(),
      )

      await waitFor(() => {
        expect(useGetOptionsResult.current.isFetching).toBe(false)
      })

      expect(useGetOptionsResult.current.data).toHaveProperty('rememberPos')

      const { result: useDeleteOptionsResult } = renderHook(() =>
        useDeleteOptions(),
      )
      const [deleteOptions] = useDeleteOptionsResult.current
      await act(async () => {
        await deleteOptions()
      })

      expect(useGetOptionsResult.current.data).toStrictEqual({})
    })
  })

  describe('useUpdateOptions', () => {
    it('should insert option and refetch in useGetOptions', async () => {
      const { result: useGetOptionsResult, waitFor } = renderHook(() =>
        useGetOptions(),
      )

      await waitFor(() => {
        expect(useGetOptionsResult.current.isFetching).toBe(false)
      })

      expect(useGetOptionsResult.current.data).not.toHaveProperty('tooltip')

      const { result: useUpdateOptionsResult } = renderHook(() =>
        useUpdateOptions(),
      )
      const [updateOptions] = useUpdateOptionsResult.current
      await act(async () => {
        await updateOptions({ tooltip: true })
      })

      expect(useGetOptionsResult.current.data).toStrictEqual({
        rememberPos: true,
        tooltip: true,
      })
    })
  })
})
