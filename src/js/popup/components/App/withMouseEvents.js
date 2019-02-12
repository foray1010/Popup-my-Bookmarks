// @flow strict

import * as React from 'react'
import EventListener from 'react-event-listener'

export default <P>(WrappedComponent: React.ComponentType<P>) => {
  return class MouseEvents extends React.PureComponent<P> {
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
      <>
        <WrappedComponent {...this.props} />
        <EventListener
          target={document}
          onContextMenu={this.handleContextMenu}
          onMouseDown={this.handleMouseDown}
        />
      </>
    )
  }
}
