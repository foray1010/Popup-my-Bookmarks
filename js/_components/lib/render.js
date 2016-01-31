import {createApp, element} from 'deku'

export default function (App, store) {
  const render = createApp(document.getElementById('container'), store.dispatch)

  const renderer = () => render(<App />, store.getState())

  renderer()
  store.subscribe(renderer)
}
