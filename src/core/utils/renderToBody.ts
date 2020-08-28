import type * as React from 'react'
import * as ReactDom from 'react-dom'

export default function renderToBody<P>(app: React.ReactElement<P>): void {
  const rootEl = document.createElement('div')
  document.body.appendChild(rootEl)

  ReactDom.render(app, rootEl)
}
