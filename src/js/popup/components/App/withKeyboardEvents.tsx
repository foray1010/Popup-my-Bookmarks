import * as React from 'react'
import EventListener from 'react-event-listener'

export default <P extends object>(WrappedComponent: React.ComponentType<P>) => (props: P) => {
  const handleKeyDown = React.useCallback((evt: KeyboardEvent) => {
    if (evt.key === 'Escape') evt.preventDefault()
  }, [])

  return (
    <React.Fragment>
      <WrappedComponent {...props} />
      <EventListener target={document} onKeyDown={handleKeyDown} />
    </React.Fragment>
  )
}
