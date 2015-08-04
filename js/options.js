import element from 'virtual-element'
import {render, tree} from 'deku'

import './_components/common'
import './_components/options/globals'
import App from './_components/options/app'

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
