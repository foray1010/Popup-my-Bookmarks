import * as React from 'react'

import useEventListener from '../../hooks/useEventListener'
import DragAndDropContext, {DragAndDropContextType} from './DragAndDropContext'

const useDragAndDropContextState = (): DragAndDropContextType => {
  const [activeKey, setActiveKeyState] = React.useState<DragAndDropContextType['activeKey']>(null)
  const [mouseCoordinate, setMouseCoordinate] = React.useState<
  DragAndDropContextType['mouseCoordinate']
  >({
    x: 0,
    y: 0
  })
  const [pendingKey, setPendingKeyState] = React.useState<DragAndDropContextType['pendingKey']>(
    null
  )

  const setActiveKey = React.useCallback((key: string) => {
    setActiveKeyState(key)
    setPendingKeyState(null)
  }, [])
  const setPendingKey = React.useCallback((key: string) => {
    setPendingKeyState(key)
    setActiveKeyState(null)
  }, [])
  const unsetAllKeys = React.useCallback(() => {
    setPendingKeyState(null)
    setActiveKeyState(null)
  }, [])

  return React.useMemo(
    () => ({
      activeKey,
      mouseCoordinate,
      pendingKey,
      setActiveKey,
      setMouseCoordinate,
      setPendingKey,
      unsetAllKeys
    }),
    [activeKey, mouseCoordinate, pendingKey, setActiveKey, setPendingKey, unsetAllKeys]
  )
}

interface Props {
  children: React.ReactNode
  onDragEnd: (evt: MouseEvent) => void
  onDrop: (evt: MouseEvent, activeKey: string) => void
}
const DragAndDropProvider = ({children, onDragEnd, onDrop}: Props) => {
  const contextState = useDragAndDropContextState()

  const {activeKey, unsetAllKeys} = contextState
  const isDragging = activeKey !== null

  const handleDrop = React.useCallback(
    (evt: MouseEvent) => {
      if (!isDragging) return

      if (evt.buttons !== 1) {
        unsetAllKeys()
        if (activeKey !== null) onDrop(evt, activeKey)
        onDragEnd(evt)
      }
    },
    [activeKey, isDragging, onDragEnd, onDrop, unsetAllKeys]
  )
  useEventListener(document.body, 'mouseenter', handleDrop)
  useEventListener(window, 'mouseup', handleDrop)

  return <DragAndDropContext.Provider value={contextState}>{children}</DragAndDropContext.Provider>
}

export default DragAndDropProvider
