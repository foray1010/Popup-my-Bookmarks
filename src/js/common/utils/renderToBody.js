// @flow strict

import * as React from 'react'
import {render} from 'react-dom'

export default (app: React.Element<any>) => {
  const rootEl = document.createElement('div')

  render(app, rootEl)

  if (document.body) document.body.appendChild(rootEl)
}
