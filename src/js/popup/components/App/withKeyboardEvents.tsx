import * as React from 'react'
import EventListener from 'react-event-listener'

export default <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return class KeyboardEvents extends React.PureComponent<P> {
    private handleKeyDown = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') evt.preventDefault()
    }

    public render = () => (
      <React.Fragment>
        <WrappedComponent {...this.props} />
        <EventListener target={document} onKeyDown={this.handleKeyDown} />
      </React.Fragment>
    )
  }
}
