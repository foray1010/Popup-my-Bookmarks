// @flow
// @jsx createElement

import {PureComponent, createElement} from 'react'
import type {ComponentType} from 'react'

export default (WrappedComponent: ComponentType<*>) => {
  return class MouseEvents extends PureComponent<*> {
    componentDidMount() {
      document.addEventListener('contextmenu', this.handleContextMenu)
      document.addEventListener('mousedown', this.handleMouseDown)
    }

    handleContextMenu = (evt: MouseEvent) => {
      // allow native context menu if it is an input element
      if (evt.target.tagName === 'INPUT') {
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

    render = () => <WrappedComponent {...this.props} />
  }
}
