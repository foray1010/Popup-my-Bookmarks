import 'babel-polyfill'

import {
  getFirstTree,
  getFlatTree,
  getStyleOptions,
  openOptionsPage,
  setPredefinedStyleSheet
} from './_components/popup/functions'
import App from './_components/popup/containers/App'
import chromep from './_components/lib/chromePromise'
import configureStore from './_components/store/configureStore'
import getOptionsConfig from './_components/getOptionsConfig'
import Immutable from 'seamless-immutable'
import reducers from './_components/popup/reducers'
import render from './_components/lib/render'

!async function () {
  const options = await chromep.storage.sync.get(null)

  /* if first run */
  const optionsConfig = await getOptionsConfig()

  for (const optionName of Object.keys(optionsConfig)) {
    if (options[optionName] === undefined) {
      return openOptionsPage()
    }
  }

  /* Init predefined stylesheet */
  const styleOptions = getStyleOptions(options)

  setPredefinedStyleSheet(styleOptions)

  /* get rootTree */
  const rootTree = await getFlatTree('0')

  rootTree.children = rootTree.children.filter((itemInfo) => {
    const itemIdNum = Number(itemInfo.id)

    const isFilterThisItem = (
      itemIdNum === options.defExpand ||
      options.hideRootFolder.indexOf(itemIdNum) >= 0
    )

    return !isFilterThisItem
  })

  /* Create a Redux store to handle all UI actions and side-effects */
  const firstTree = await getFirstTree(options)

  const store = configureStore(reducers, Immutable({
    itemOffsetHeight: styleOptions.itemOffsetHeight,
    options: options,
    rootTree: rootTree,
    trees: [firstTree]
  }))

  /* render the app */
  render(App, store)
}().catch((err) => console.error(err.stack))
