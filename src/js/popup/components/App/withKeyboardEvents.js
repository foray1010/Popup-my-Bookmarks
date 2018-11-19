// @flow strict @jsx createElement

import {Fragment, PureComponent, createElement} from 'react'
import type {ComponentType} from 'react'
import EventListener from 'react-event-listener'

export default <P>(WrappedComponent: ComponentType<P>) => {
  return class KeyboardEvents extends PureComponent<P> {
    handleKeyDown = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') evt.preventDefault()
    }

    render = () => (
      <Fragment>
        <WrappedComponent {...this.props} />
        <EventListener target={document} onKeyDown={this.handleKeyDown} />
      </Fragment>
    )
  }
}
