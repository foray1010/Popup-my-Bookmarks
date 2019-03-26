import debounce from 'lodash.debounce'
import * as React from 'react'
import {ListOnScrollProps} from 'react-window'

import {lastPositionsCreators} from '../../reduxs'

export default ({
  createLastPosition,
  isRememberLastPositions,
  removeLastPosition,
  treeId,
  treeIndex,
  updateLastPosition
}: {
  createLastPosition: typeof lastPositionsCreators.createLastPosition
  isRememberLastPositions: boolean
  removeLastPosition: typeof lastPositionsCreators.removeLastPosition
  treeId: string
  treeIndex: number
  updateLastPosition: typeof lastPositionsCreators.updateLastPosition
}) => {
  React.useEffect(() => {
    if (isRememberLastPositions) createLastPosition(treeIndex, treeId)

    return () => {
      if (isRememberLastPositions) removeLastPosition(treeIndex)
    }
  }, [createLastPosition, isRememberLastPositions, removeLastPosition, treeId, treeIndex])

  return {
    handleScroll: React.useMemo(() => {
      if (!isRememberLastPositions) return undefined

      const debouncedUpdateLastPosition = debounce(updateLastPosition, 100)
      return (evt: ListOnScrollProps) => {
        debouncedUpdateLastPosition({
          id: treeId,
          scrollTop: evt.scrollOffset
        })
      }
    }, [isRememberLastPositions, treeId, updateLastPosition])
  }
}
