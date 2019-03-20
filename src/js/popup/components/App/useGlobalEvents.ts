import * as React from 'react'

export default () => {
  React.useEffect(() => {
    const handleContextMenu = (evt: MouseEvent) => {
      // allow native context menu if it is an input element
      if (evt.target instanceof HTMLElement && evt.target.tagName === 'INPUT') {
        return
      }

      // disable native context menu
      evt.preventDefault()
    }

    document.addEventListener('contextmenu', handleContextMenu)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  React.useEffect(() => {
    const handleMouseDown = (evt: MouseEvent) => {
      // disable the scrolling arrows after middle click
      if (evt.button === 1) evt.preventDefault()
    }

    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])
}
