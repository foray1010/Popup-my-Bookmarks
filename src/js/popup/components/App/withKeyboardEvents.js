// @flow strict

import * as React from 'react'
import EventListener from 'react-event-listener'

export default <P>(WrappedComponent: React.ComponentType<P>) => {
  return class KeyboardEvents extends React.PureComponent<P> {
    handleKeyDown = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') evt.preventDefault()
    }

    render = () => (
      <>
        <WrappedComponent {...this.props} />
        <EventListener target={document} onKeyDown={this.handleKeyDown} />
      </>
    )
  }
}
