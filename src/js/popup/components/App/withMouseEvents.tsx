import * as React from 'react'
import EventListener from 'react-event-listener'

export default <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return class MouseEvents extends React.PureComponent<P> {
    private handleContextMenu = (evt: MouseEvent) => {
      // allow native context menu if it is an input element
      if (evt.target instanceof HTMLElement && evt.target.tagName === 'INPUT') {
        return
      }

      // disable native context menu
      evt.preventDefault()
    }

    private handleMouseDown = (evt: MouseEvent) => {
      // disable the scrolling arrows after middle click
      if (evt.button === 1) {
        evt.preventDefault()
      }
    }

    public render = () => (
      <React.Fragment>
        <WrappedComponent {...this.props} />
        <EventListener
          target={document}
          onContextMenu={this.handleContextMenu}
          onMouseDown={this.handleMouseDown}
        />
      </React.Fragment>
    )
  }
}
