import element from 'virtual-element'
import {render, tree} from 'deku'

import './_components/common'
import './_components/popup/globals'
import App from './_components/popup/app'

chromep.storage.sync.get(null)
  .then((options) => {
    globals.options = Immutable(options)

    // if first run
    if (globals.options.hideRootFolder === undefined) {
      globals.openOptionsPage()
    }
  })
  .then(() => {
    return globals.getFlatTree('0')
      .then((treeInfo) => {
        treeInfo.children = treeInfo.children.filter((itemInfo) => {
          const itemIdNum = parseInt(itemInfo.id, 10)

          const isFilterThisItem = (
            itemIdNum === globals.options.defExpand ||
            globals.options.hideRootFolder.indexOf(itemIdNum) >= 0
          )

          return !isFilterThisItem
        })

        globals.rootTree = Immutable(treeInfo)
      })
  })
  .then(() => {
    globals.getFlatTree(String(globals.options.defExpand))
      .then((defExpandTree) => {
        const app = tree(
          <App defExpandTree={defExpandTree} />
        )

        render(app, document.getElementById('container'))
      })
  })
