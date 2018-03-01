// @flow

import type {Element} from 'react'
import {render} from 'react-dom'

export default (app: Element<*>) => {
  const rootEl = document.createElement('div')

  render(app, rootEl)

  if (document.body) document.body.appendChild(rootEl)
}
