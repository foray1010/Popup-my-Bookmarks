import * as React from 'react'
import webExtension from 'webextension-polyfill'

import type { LastPosition } from '../../types'

export default function useRememberLastPositions({
  isEnabled,
}: {
  readonly isEnabled: boolean
}) {
  const [lastPositions, setLastPositions] = React.useState<LastPosition[]>([])
  const [isInitialized, setIsInitialized] = React.useState(false)
  React.useEffect(() => {
    if (isEnabled) {
      interface LocaleStorage {
        lastPositions?: LastPosition[]
      }
      webExtension.storage.local
        .get()
        .then((localStorage: LocaleStorage) => {
          setLastPositions(localStorage.lastPositions ?? [])
          setIsInitialized(true)
        })
        .catch(console.error)
    } else {
      setLastPositions([])
      setIsInitialized(false)
    }
  }, [isEnabled])
  React.useEffect(() => {
    if (!isInitialized) return

    webExtension.storage.local.set({ lastPositions }).catch(console.error)
  }, [isInitialized, lastPositions])

  return {
    isInitialized,
    lastPositions: isEnabled ? lastPositions : undefined,

    registerLastPosition: React.useCallback(
      (index: number, id: string) => {
        if (!isInitialized) return

        setLastPositions((prevLastPositions) => {
          if (
            index > prevLastPositions.length ||
            prevLastPositions.some((x) => x.id === id)
          ) {
            return prevLastPositions
          }

          return [...prevLastPositions.slice(0, index), { id, scrollTop: 0 }]
        })
      },
      [isInitialized],
    ),

    unregisterLastPosition: React.useCallback(
      (id: string) => {
        if (!isInitialized) return

        setLastPositions((prevLastPositions) => {
          const index = prevLastPositions.findIndex((x) => x.id === id)
          if (index === -1) return prevLastPositions

          return prevLastPositions.slice(0, index)
        })
      },
      [isInitialized],
    ),

    updateLastPosition: React.useCallback(
      (id: string, scrollTop: number) => {
        if (!isInitialized) return

        setLastPositions((prevLastPositions) => {
          return prevLastPositions.map((lastPosition) => {
            if (lastPosition.id === id) return { id, scrollTop }
            return lastPosition
          })
        })
      },
      [isInitialized],
    ),
  }
}
