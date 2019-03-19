import * as React from 'react'
import EventListener from 'react-event-listener'

export default <P extends object>(WrappedComponent: React.ComponentType<P>) => (props: P) => {
  const handleContextMenu = React.useCallback((evt: MouseEvent) => {
    // allow native context menu if it is an input element
    if (evt.target instanceof HTMLElement && evt.target.tagName === 'INPUT') {
      return
    }

    // disable native context menu
    evt.preventDefault()
  }, [])

  const handleMouseDown = React.useCallback((evt: MouseEvent) => {
    // disable the scrolling arrows after middle click
    if (evt.button === 1) {
      evt.preventDefault()
    }
  }, [])

  return (
    <React.Fragment>
      <WrappedComponent {...props} />
      <EventListener
        target={document}
        onContextMenu={handleContextMenu}
        onMouseDown={handleMouseDown}
      />
    </React.Fragment>
  )
}
