import {render} from 'react-dom'

export default (app) => {
  const rootEl = document.createElement('div')
  document.body.appendChild(rootEl)

  render(app, rootEl)
}
