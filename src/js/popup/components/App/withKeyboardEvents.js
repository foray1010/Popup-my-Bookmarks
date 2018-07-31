// @flow strict @jsx createElement

import {Fragment, PureComponent, createElement} from 'react'
import type {ComponentType} from 'react'
import EventListener from 'react-event-listener'

export default (WrappedComponent: ComponentType<any>) => {
  return class KeyboardEvents extends PureComponent<any> {
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
