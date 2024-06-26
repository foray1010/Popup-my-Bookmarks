import { act, renderHook, waitFor } from '@testing-library/react'
import webExtension from 'webextension-polyfill'

import { LastPositionsProvider, useLastPositionsContext } from './index.js'

describe('LastPositionsProvider + useLastPositionsContext', () => {
  beforeEach(async () => {
    await webExtension.storage.local.clear()
    await webExtension.storage.local.set({
      lastPositions: [{ id: '1', scrollTop: 10 }],
    })
  })

  it('should fetch lastPosition when isEnabled changes from false to true', async () => {
    let isEnabled = false

    const { result, rerender } = renderHook(useLastPositionsContext, {
      wrapper: (props) => (
        <LastPositionsProvider {...props} isEnabled={isEnabled} />
      ),
    })

    expect(result.current.lastPositions).toBeUndefined()

    isEnabled = true
    rerender()

    await waitFor(() => expect(result.current.isInitialized).toBe(true))

    expect(result.current.lastPositions).toStrictEqual([
      { id: '1', scrollTop: 10 },
    ])
  })

  describe('registerLastPosition', () => {
    it('should register new lastPosition', async () => {
      const { result } = renderHook(useLastPositionsContext, {
        wrapper: (props) => (
          <LastPositionsProvider {...props} isEnabled={true} />
        ),
      })

      await waitFor(() => expect(result.current.isInitialized).toBe(true))

      act(() => {
        result.current.registerLastPosition(1, '2')
      })

      expect(result.current.lastPositions).toStrictEqual([
        { id: '1', scrollTop: 10 },
        { id: '2', scrollTop: 0 },
      ])
    })

    it('should override existing index when registering lastPosition', async () => {
      const { result } = renderHook(useLastPositionsContext, {
        wrapper: (props) => (
          <LastPositionsProvider {...props} isEnabled={true} />
        ),
      })

      await waitFor(() => expect(result.current.isInitialized).toBe(true))

      act(() => {
        result.current.registerLastPosition(0, '2')
      })

      expect(result.current.lastPositions).toStrictEqual([
        { id: '2', scrollTop: 0 },
      ])
    })

    it('should not insert new index when previous index does not exist', async () => {
      const { result } = renderHook(useLastPositionsContext, {
        wrapper: (props) => (
          <LastPositionsProvider {...props} isEnabled={true} />
        ),
      })

      await waitFor(() => expect(result.current.isInitialized).toBe(true))

      act(() => {
        result.current.registerLastPosition(2, '2')
      })

      expect(result.current.lastPositions).toStrictEqual([
        { id: '1', scrollTop: 10 },
      ])
    })

    it('should not override existing index when registering the same id', async () => {
      const { result } = renderHook(useLastPositionsContext, {
        wrapper: (props) => (
          <LastPositionsProvider {...props} isEnabled={true} />
        ),
      })

      await waitFor(() => expect(result.current.isInitialized).toBe(true))

      act(() => {
        result.current.registerLastPosition(0, '1')
      })

      expect(result.current.lastPositions).toStrictEqual([
        { id: '1', scrollTop: 10 },
      ])
    })

    it('should not insert new index when registering the same id', async () => {
      const { result } = renderHook(useLastPositionsContext, {
        wrapper: (props) => (
          <LastPositionsProvider {...props} isEnabled={true} />
        ),
      })

      await waitFor(() => expect(result.current.isInitialized).toBe(true))

      act(() => {
        result.current.registerLastPosition(1, '1')
      })

      expect(result.current.lastPositions).toStrictEqual([
        { id: '1', scrollTop: 10 },
      ])
    })
  })

  describe('unregisterLastPosition', () => {
    it('should unregister existing lastPosition by id', async () => {
      const { result } = renderHook(useLastPositionsContext, {
        wrapper: (props) => (
          <LastPositionsProvider {...props} isEnabled={true} />
        ),
      })

      await waitFor(() => expect(result.current.isInitialized).toBe(true))

      act(() => {
        result.current.unregisterLastPosition('1')
      })

      expect(result.current.lastPositions).toStrictEqual([])
    })

    it('should skip when id is not registered', async () => {
      const { result } = renderHook(useLastPositionsContext, {
        wrapper: (props) => (
          <LastPositionsProvider {...props} isEnabled={true} />
        ),
      })

      await waitFor(() => expect(result.current.isInitialized).toBe(true))

      act(() => {
        result.current.unregisterLastPosition('999')
      })

      expect(result.current.lastPositions).toStrictEqual([
        { id: '1', scrollTop: 10 },
      ])
    })
  })

  describe('updateLastPosition', () => {
    it('should update existing lastPosition by id', async () => {
      const { result } = renderHook(useLastPositionsContext, {
        wrapper: (props) => (
          <LastPositionsProvider {...props} isEnabled={true} />
        ),
      })

      await waitFor(() => expect(result.current.isInitialized).toBe(true))

      act(() => {
        result.current.updateLastPosition('1', 99)
      })

      expect(result.current.lastPositions).toStrictEqual([
        { id: '1', scrollTop: 99 },
      ])
    })

    it('should skip when id is not registered', async () => {
      const { result } = renderHook(useLastPositionsContext, {
        wrapper: (props) => (
          <LastPositionsProvider {...props} isEnabled={true} />
        ),
      })

      await waitFor(() => expect(result.current.isInitialized).toBe(true))

      act(() => {
        result.current.updateLastPosition('99', 99)
      })

      expect(result.current.lastPositions).toStrictEqual([
        { id: '1', scrollTop: 10 },
      ])
    })
  })
})
