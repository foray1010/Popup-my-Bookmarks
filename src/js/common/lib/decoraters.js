import {decorate} from 'core-decorators'

export const requestAnimationFrame = decorate(function (fn) {
  return () => window.requestAnimationFrame(fn.bind(this))
})
