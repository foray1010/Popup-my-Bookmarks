import element from 'virtual-element'
import {render, tree} from 'deku'

import './_components/common'
import './_components/options/globals'
import App from './_components/options/app'

chromep.storage.sync.get(null)
  .then((storage) => {
    const app = tree(
      <App initialStorage={storage} />
    )

    render(app, document.getElementById('container'))
  })
