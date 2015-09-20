import element from 'virtual-element'
import {render, tree} from 'deku'

import './_components/common'
import './_components/popup/globals'
import App from './_components/popup/app'

!async function() {
  globals.options = Immutable(await chromep.storage.sync.get(null))

  // if first run
  if (globals.options.hideRootFolder === undefined) {
    globals.openOptionsPage()
  }

  /* get globals.rootTree */
  const treeInfo = await globals.getFlatTree('0')

  treeInfo.children = treeInfo.children.filter((itemInfo) => {
    const itemIdNum = parseInt(itemInfo.id, 10)

    const isFilterThisItem = (
      itemIdNum === globals.options.defExpand ||
      globals.options.hideRootFolder.indexOf(itemIdNum) >= 0
    )

    return !isFilterThisItem
  })

  globals.rootTree = Immutable(treeInfo)

  /* render the app */
  const defExpandTree = await globals.getFlatTree(String(globals.options.defExpand))

  const app = tree(
    <App defExpandTree={defExpandTree} />
  )

  render(app, document.getElementById('container'))
}()
