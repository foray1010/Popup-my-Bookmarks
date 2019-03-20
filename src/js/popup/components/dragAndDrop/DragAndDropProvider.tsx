import * as React from 'react'
import EventListener from 'react-event-listener'

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

  const handleDrop = React.useCallback(
    (evt: MouseEvent) => {
      unsetAllKeys()
      if (activeKey !== null) onDrop(evt, activeKey)
      onDragEnd(evt)
    },
    [activeKey, onDragEnd, onDrop, unsetAllKeys]
  )

  // may not be needed, just in case
  const handleMouseEnterWindow = React.useCallback(
    (evt: MouseEvent) => {
      // if user mouse up outside of the window, `mouseup` event may not be fired
      // this hack let us know if user mouse up outside of the window and go back to window
      // onDrop() should not be called because we are not sure that means user wanna drop
      if (evt.buttons !== 1) {
        unsetAllKeys()
        onDragEnd(evt)
      }
    },
    [onDragEnd, unsetAllKeys]
  )

  return (
    <React.Fragment>
      <DragAndDropContext.Provider value={contextState}>{children}</DragAndDropContext.Provider>
      {activeKey !== null && (
        <EventListener
          target={window}
          onMouseEnter={handleMouseEnterWindow}
          onMouseUp={handleDrop}
        />
      )}
    </React.Fragment>
  )
}

export default DragAndDropProvider
