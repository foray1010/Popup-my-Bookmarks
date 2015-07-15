import {element, render, tree} from 'deku'

import './_components/common'
import App from './_components/options/app'

window.globals = {}

new Promise((resolve) => {
  chrome.storage.sync.get(null, (storage) => {
    resolve(Immutable(storage))
  })
})
  .then((storage) => {
    const app = tree(
      <App storage={storage} />
    )

    render(app, document.getElementById('container'))
  })
