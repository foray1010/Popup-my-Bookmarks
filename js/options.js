import element from 'virtual-element'
import {render, tree} from 'deku'

import './_components/common'
import './_components/options/globals'
import App from './_components/options/app'
import getOptionsConfig from './_components/options/get_options_config'

!async function () {
  globals.optionsConfig = await getOptionsConfig()

  await globals.initOptionsValue()

  const app = tree(<App />)

  render(app, document.getElementById('container'))
}().catch((e) => console.error(e.stack))
