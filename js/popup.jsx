import 'babel-polyfill'
import {createApp, element} from 'deku'

import './_components/popup/globals'
import App from './_components/popup/containers/App'
import chromep from './_components/lib/chromePromise'
import configureStore from './_components/store/configureStore'
import getOptionsConfig from './_components/getOptionsConfig'
import Immutable from 'seamless-immutable'
import reducers from './_components/popup/reducers'

!async function () {
  const options = await chromep.storage.sync.get(null)

  /* if first run */
  const optionsConfig = await getOptionsConfig()

  for (const optionName of Object.keys(optionsConfig)) {
    if (options[optionName] === undefined) {
      return globals.openOptionsPage()
    }
  }

  /* get globals.rootTree */
  const rootTree = await globals.getFlatTree('0')

  rootTree.children = rootTree.children.filter((itemInfo) => {
    const itemIdNum = Number(itemInfo.id)

    const isFilterThisItem = (
      itemIdNum === options.defExpand ||
      options.hideRootFolder.indexOf(itemIdNum) >= 0
    )

    return !isFilterThisItem
  })

  /* Create a Redux store to handle all UI actions and side-effects */
  const firstTree = await globals.getFirstTree(options)

  const store = configureStore(reducers, Immutable({
    options: options,
    rootTree: rootTree,
    trees: [firstTree]
  }))

  /* render the app */
  const render = createApp(document.getElementById('container'), store.dispatch)

  const renderer = () => render(<App />, store.getState())

  renderer()
  store.subscribe(renderer)
}().catch((err) => console.error(err.stack))
