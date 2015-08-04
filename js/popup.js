import element from 'virtual-element'
import {render, tree} from 'deku'

import './_components/common'
import './_components/popup/globals'
import App from './_components/popup/app'

chromep.storage.sync.get(null)
  .then((storage) => {
    globals.storage = Immutable(storage)

    // +2 for border width, goldenGap*2 for padding
    globals.itemHeight = 2 + globals.goldenGap * 2 +
      Math.max(globals.storage.fontSize, 16)

    // if first run
    if (globals.storage.hideRootFolder === undefined) {
      globals.openOptionsPage()
    }
  })
  .then(() => {
    return globals.getFlatTree('0')
      .then((treeInfo) => {
        treeInfo.children = treeInfo.children.filter((itemInfo) => {
          const itemIdNum = 1 * itemInfo.id

          const isFilterThisItem = (
            itemIdNum === globals.storage.defExpand ||
            globals.storage.hideRootFolder.indexOf(itemIdNum) >= 0
          )

          return !isFilterThisItem
        })

        globals.rootTree = Immutable(treeInfo)
      })
  })
  .then(() => {
    globals.getFlatTree('' + globals.storage.defExpand)
      .then((defExpandTree) => {
        const app = tree(
          <App defExpandTree={defExpandTree} />
        )

        render(app, document.getElementById('container'))
      })
  })
