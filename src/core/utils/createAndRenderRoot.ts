import type * as React from 'react'
import * as ReactDom from 'react-dom/client'

export default function createAndRenderRoot<P>(
  app: React.ReactElement<P>,
): ReactDom.Root {
  const rootEl = document.createElement('div')
  document.body.appendChild(rootEl)

  const root = ReactDom.createRoot(rootEl)
  root.render(app)

  return root
}
