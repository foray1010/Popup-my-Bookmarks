import type * as React from 'react'
import * as ReactDom from 'react-dom'

export default <P>(app: React.ReactElement<P>) => {
  const rootEl = document.createElement('div')

  ReactDom.render(app, rootEl)

  if (document.body) document.body.appendChild(rootEl)
}
