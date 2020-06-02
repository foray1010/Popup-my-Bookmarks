import debounce from 'lodash.debounce'
import * as React from 'react'
import type { ListOnScrollProps } from 'react-window'

import useAction from '../../../core/hooks/useAction'
import { lastPositionsCreators } from '../../reduxs'

export default ({
  isRememberLastPositions,
  treeId,
  treeIndex,
}: {
  isRememberLastPositions: boolean
  treeId: string
  treeIndex: number
}) => {
  const createLastPosition = useAction(lastPositionsCreators.createLastPosition)
  const removeLastPosition = useAction(lastPositionsCreators.removeLastPosition)
  const updateLastPosition = useAction(lastPositionsCreators.updateLastPosition)

  React.useEffect(() => {
    if (isRememberLastPositions) createLastPosition(treeIndex, treeId)

    return () => {
      if (isRememberLastPositions) removeLastPosition(treeIndex)
    }
  }, [
    createLastPosition,
    isRememberLastPositions,
    removeLastPosition,
    treeId,
    treeIndex,
  ])

  return {
    handleScroll: React.useMemo(() => {
      if (!isRememberLastPositions) return undefined

      const debouncedUpdateLastPosition = debounce(updateLastPosition, 100)
      return (evt: ListOnScrollProps) => {
        debouncedUpdateLastPosition({
          id: treeId,
          scrollTop: evt.scrollOffset,
        })
      }
    }, [isRememberLastPositions, treeId, updateLastPosition]),
  }
}
