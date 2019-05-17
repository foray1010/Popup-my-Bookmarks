import * as React from 'react'

import useEventListener from '../../hooks/useEventListener'

export default () => {
  const handleContextMenu = React.useCallback((evt: MouseEvent) => {
    // allow native context menu if it is an input element
    if (evt.target instanceof HTMLElement && evt.target.tagName === 'INPUT') {
      return
    }

    // disable native context menu
    evt.preventDefault()
  }, [])
  useEventListener(document, 'contextmenu', handleContextMenu)

  const handleKeyDown = React.useCallback((evt: KeyboardEvent) => {
    const isFocusedOnInputWithoutValue =
      document.activeElement !== null &&
      (document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement) &&
      document.activeElement.value === ''
    if (evt.key === 'Escape' && isFocusedOnInputWithoutValue) {
      window.close()
    }
  }, [])
  useEventListener(document, 'keydown', handleKeyDown)

  const handleMouseDown = React.useCallback((evt: MouseEvent) => {
    // disable the scrolling arrows after middle click
    if (evt.button === 1) evt.preventDefault()
  }, [])
  useEventListener(document, 'mousedown', handleMouseDown)
}
