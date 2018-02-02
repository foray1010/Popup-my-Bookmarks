import PropTypes from 'prop-types'
import {PureComponent, createElement} from 'react'
import webExtension from 'webextension-polyfill'

export default (WrappedComponent) => {
  return class extends PureComponent {
    static propTypes = {
      dragEnd: PropTypes.func.isRequired,
      dragIndicator: PropTypes.object,
      dragTarget: PropTypes.object
    }

    componentDidMount() {
      document.documentElement.addEventListener('contextmenu', this.handleContextMenu)
      document.documentElement.addEventListener('mousedown', this.handleMouseDown)
      document.documentElement.addEventListener('mouseup', this.handleDragEnd)
    }

    handleContextMenu = (evt) => {
      // allow native context menu if it is an input element
      if (evt.target.tagName === 'INPUT') {
        return
      }

      // disable native context menu
      evt.preventDefault()
    }

    // hack to stimulate onDragEnd event
    // onDragEnd doesn't work when original drag element is removed from DOM,
    // but onMouseUp still fire
    handleDragEnd = async () => {
      const {dragEnd, dragIndicator, dragTarget} = this.props

      if (dragTarget) {
        if (dragIndicator) {
          await webExtension.bookmarks.move(dragTarget.id, {
            parentId: dragIndicator.parentId,
            index: dragIndicator.index
          })
        }

        dragEnd()
      }
    }

    handleMouseDown = (evt) => {
      // disable the scrolling arrows after middle click
      if (evt.button === 1) {
        evt.preventDefault()
      }
    }

    render = () => <WrappedComponent {...this.props} />
  }
}
