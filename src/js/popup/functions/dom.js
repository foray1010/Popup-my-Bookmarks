// @flow

export const resetBodySize = (): void => {
  const body = document.body
  if (body) {
    // reset to original size
    body.style.height = ''
    body.style.width = ''
  }
}
