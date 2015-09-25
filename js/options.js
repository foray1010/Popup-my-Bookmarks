import element from 'virtual-element'
import {render, tree} from 'deku'

import './_components/common'
import './_components/options/globals'
import App from './_components/options/app'
import getOptionsConfig from './_components/options/get_options_config'

!async function() {
  globals.optionsConfig = await getOptionsConfig()

  await globals.initOptionsValue()

  const currentModule = Object.keys(globals.optionTableMap)[0]

  const options = await globals.getCurrentModuleOptions(currentModule)

  const app = tree(
    <App
      initialCurrentModule={currentModule}
      initialOptions={options} />
  )

  render(app, document.getElementById('container'))
}().catch((e) => console.error(e.stack))
