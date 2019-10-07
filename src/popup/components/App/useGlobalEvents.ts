import useEventListener from 'use-typed-event-listener'

export default () => {
  useEventListener(document, 'contextmenu', evt => {
    // allow native context menu if it is an input element
    if (evt.target instanceof HTMLInputElement) {
      return
    }

    // disable native context menu
    evt.preventDefault()
  })

  useEventListener(document, 'keydown', evt => {
    const isFocusedOnInputWithoutValue =
      document.activeElement instanceof HTMLInputElement && document.activeElement.value === ''
    if (evt.key === 'Escape' && isFocusedOnInputWithoutValue) {
      window.close()
    }
  })

  useEventListener(document, 'mousedown', evt => {
    // disable the scrolling arrows after middle click
    if (evt.button === 1) evt.preventDefault()
  })
}
