const {
  cancelAnimationFrame,
  requestAnimationFrame
} = window

export default (fn) => {
  let requestId = null

  return (...args) => {
    if (requestId) cancelAnimationFrame(requestId)

    requestId = requestAnimationFrame(() => {
      fn(...args)

      requestId = null
    })
  }
}
