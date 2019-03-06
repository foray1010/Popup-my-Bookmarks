import * as React from 'react'
import {render} from 'react-dom'

export default (app: React.ReactElement) => {
  const rootEl = document.createElement('div')

  render(app, rootEl)

  if (document.body) document.body.appendChild(rootEl)
}
