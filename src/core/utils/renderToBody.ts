import * as React from 'react'
import * as ReactDom from 'react-dom'

export default (app: React.ReactElement<{}>) => {
  const rootEl = document.createElement('div')

  ReactDom.render(app, rootEl)

  if (document.body) document.body.appendChild(rootEl)
}
