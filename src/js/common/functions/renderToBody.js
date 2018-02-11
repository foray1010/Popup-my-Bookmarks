import {render} from 'react-dom'

export default (app) => {
  const rootEl = document.createElement('div')

  render(app, rootEl)

  document.body.appendChild(rootEl)
}
