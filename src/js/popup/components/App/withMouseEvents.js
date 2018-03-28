// @flow
// @jsx createElement

import {Fragment, PureComponent, createElement} from 'react'
import type {ComponentType} from 'react'
import EventListener from 'react-event-listener'

export default (WrappedComponent: ComponentType<*>) => {
  return class MouseEvents extends PureComponent<*> {
    handleContextMenu = (evt: MouseEvent) => {
      // allow native context menu if it is an input element
      if (evt.target instanceof window.HTMLElement && evt.target.tagName === 'INPUT') {
        return
      }

      // disable native context menu
      evt.preventDefault()
    }

    handleMouseDown = (evt: MouseEvent) => {
      // disable the scrolling arrows after middle click
      if (evt.button === 1) {
        evt.preventDefault()
      }
    }

    render = () => (
      <Fragment>
        <WrappedComponent {...this.props} />
        <EventListener
          target={document}
          onContextMenu={this.handleContextMenu}
          onMouseDown={this.handleMouseDown}
        />
      </Fragment>
    )
  }
}
