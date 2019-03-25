import debounce from 'lodash.debounce'
import * as React from 'react'
import {ListOnScrollProps} from 'react-window'

import {lastPositionsCreators} from '../../reduxs'

export default ({
  createLastPosition,
  isRememberLastPosition,
  removeLastPosition,
  treeId,
  treeIndex,
  updateLastPosition
}: {
  createLastPosition: typeof lastPositionsCreators.createLastPosition
  isRememberLastPosition: boolean
  removeLastPosition: typeof lastPositionsCreators.removeLastPosition
  treeId: string
  treeIndex: number
  updateLastPosition: typeof lastPositionsCreators.updateLastPosition
}) => {
  React.useEffect(() => {
    if (isRememberLastPosition) createLastPosition(treeIndex, treeId)

    return () => {
      if (isRememberLastPosition) removeLastPosition(treeIndex)
    }
  }, [createLastPosition, isRememberLastPosition, removeLastPosition, treeId, treeIndex])

  return {
    handleScroll: React.useMemo(() => {
      if (!isRememberLastPosition) return undefined

      const debouncedUpdateLastPosition = debounce(updateLastPosition, 100)
      return (evt: ListOnScrollProps) => {
        debouncedUpdateLastPosition({
          id: treeId,
          scrollTop: evt.scrollOffset
        })
      }
    }, [isRememberLastPosition, treeId, updateLastPosition])
  }
}
