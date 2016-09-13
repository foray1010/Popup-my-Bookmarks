import 'babel-polyfill'
import {createElement} from 'react'
import {Provider} from 'react-redux'
import {render} from 'react-dom'
import Immutable from 'seamless-immutable'

import {
  getFirstTree,
  getFlatTree,
  getItemOffsetHeight,
  openOptionsPage
} from './functions'
import App from './containers/App'
import chromep from '../common/lib/chromePromise'
import configureStore from '../common/store/configureStore'
import getOptionsConfig from '../common/lib/getOptionsConfig'
import reducers from './reducers'

!async function () {
  const options = await chromep.storage.sync.get(null)

  /* if first run */
  const optionsConfig = await getOptionsConfig()

  for (const optionName of Object.keys(optionsConfig)) {
    if (options[optionName] === undefined) {
      await openOptionsPage()
      return
    }
  }

  /* get rootTree */
  const rootTree = await getFlatTree('0')

  rootTree.children = rootTree.children.filter((itemInfo) => {
    const itemIdNum = Number(itemInfo.id)

    const isFilterThisItem = (
      itemIdNum === options.defExpand ||
      options.hideRootFolder.includes(itemIdNum)
    )

    return !isFilterThisItem
  })

  /* Create a Redux store to handle all UI actions and side-effects */
  const firstTree = await getFirstTree(options)

  const store = configureStore(reducers, Immutable({
    itemOffsetHeight: getItemOffsetHeight(options),
    options: options,
    rootTree: rootTree,
    trees: [firstTree]
  }))

  /* render the app */
  render((
    <Provider store={store}>
      <App />
    </Provider>
  ), document.getElementById('container'))
}().catch((err) => console.error(err.stack))
