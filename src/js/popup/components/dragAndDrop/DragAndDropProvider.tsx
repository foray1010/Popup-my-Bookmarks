import * as React from 'react'

import DragAndDropContext, {DragAndDropContextType} from './DragAndDropContext'

const useDragAndDropContextState = () => {
  const [activeKey, setActiveKeyState] = React.useState<DragAndDropContextType['activeKey']>(null)
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
      pendingKey,
      setActiveKey,
      setPendingKey,
      unsetAllKeys
    }),
    [activeKey, pendingKey, setActiveKey, setPendingKey, unsetAllKeys]
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

  React.useEffect(() => {
    if (activeKey === null) return undefined

    const handleDrop = (evt: MouseEvent) => {
      if (evt.buttons !== 1) {
        unsetAllKeys()
        if (activeKey !== null) onDrop(evt, activeKey)
        onDragEnd(evt)
      }
    }

    document.body.addEventListener('mouseenter', handleDrop)
    window.addEventListener('mouseup', handleDrop)

    return () => {
      document.body.removeEventListener('mouseenter', handleDrop)
      window.removeEventListener('mouseup', handleDrop)
    }
  }, [activeKey, onDragEnd, onDrop, unsetAllKeys])

  return <DragAndDropContext.Provider value={contextState}>{children}</DragAndDropContext.Provider>
}

export default DragAndDropProvider
