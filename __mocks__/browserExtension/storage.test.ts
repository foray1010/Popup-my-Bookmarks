import storage from './storage.js'

describe('browser.storage', () => {
  it('should fire callback for listeners', async () => {
    const testCallback = jest.fn()

    storage.onChanged.addListener(testCallback)
    expect(storage.onChanged.hasListener(testCallback)).toBe(true)

    await storage.local.set({ where: 'local' })
    await storage.local.set({ where: undefined }) // Should be ignored
    expect(testCallback.mock.calls).toHaveLength(1)
    expect(testCallback).toHaveBeenLastCalledWith(
      { where: { newValue: 'local' } },
      'local',
    )

    await storage.local.remove('where')
    expect(testCallback.mock.calls).toHaveLength(2)
    expect(testCallback).toHaveBeenLastCalledWith(
      { where: { oldValue: 'local' } },
      'local',
    )

    await storage.sync.set({ where: 'sync' })
    expect(testCallback.mock.calls).toHaveLength(3)
    expect(testCallback).toHaveBeenLastCalledWith(
      { where: { newValue: 'sync' } },
      'sync',
    )

    await storage.sync.set({ where: 'sync2' })
    expect(testCallback.mock.calls).toHaveLength(4)
    expect(testCallback).toHaveBeenLastCalledWith(
      { where: { oldValue: 'sync', newValue: 'sync2' } },
      'sync',
    )

    await storage.sync.set({ secondNewField: 'secondNewField' })
    expect(testCallback.mock.calls).toHaveLength(5)
    expect(testCallback).toHaveBeenLastCalledWith(
      { secondNewField: { newValue: 'secondNewField' } },
      'sync',
    )

    await storage.sync.clear()
    expect(testCallback.mock.calls).toHaveLength(6)
    expect(testCallback).toHaveBeenLastCalledWith(
      {
        where: { oldValue: 'sync2' },
        secondNewField: { oldValue: 'secondNewField' },
      },
      'sync',
    )

    await storage.managed.set({ where: 'managed' })
    expect(testCallback.mock.calls).toHaveLength(7)
    expect(testCallback).toHaveBeenLastCalledWith(
      { where: { newValue: 'managed' } },
      'managed',
    )
  })

  it('should not fire callback after removing listeners', async () => {
    const testCallback = jest.fn()

    storage.onChanged.addListener(testCallback)
    expect(storage.onChanged.hasListener(testCallback)).toBe(true)

    storage.onChanged.removeListener(testCallback)
    expect(storage.onChanged.hasListener(testCallback)).toBe(false)

    await storage.local.set({ where: 'local' })
    await storage.local.set({ where: undefined })
    await storage.local.remove('where')
    await storage.sync.set({ where: 'sync' })
    await storage.sync.set({ where: 'sync2' })
    await storage.sync.set({ secondNewField: 'secondNewField' })
    await storage.sync.clear()
    await storage.managed.set({ where: 'managed' })

    expect(testCallback).not.toHaveBeenCalled()
  })

  it('should fire callback for all listeners', async () => {
    const testCallback1 = jest.fn()
    storage.onChanged.addListener(testCallback1)

    const testCallback2 = jest.fn()
    storage.onChanged.addListener(testCallback2)

    await storage.local.set({ where: 'local' })

    expect(testCallback1).toHaveBeenLastCalledWith(
      { where: { newValue: 'local' } },
      'local',
    )

    expect(testCallback2).toHaveBeenLastCalledWith(
      { where: { newValue: 'local' } },
      'local',
    )
  })
})
