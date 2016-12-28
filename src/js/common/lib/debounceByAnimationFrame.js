/* @flow */

const {
  cancelAnimationFrame,
  requestAnimationFrame
} = window

export default (fn: Function): Function => {
  let requestId: ?number = null

  return (...args: any[]): void => {
    if (requestId) cancelAnimationFrame(requestId)

    requestId = requestAnimationFrame((): void => {
      fn(...args)

      requestId = null
    })
  }
}
