import Chance from 'chance'
import * as R from 'ramda'

import * as CST from '../../../../constants'

const chance = new Chance('bookmarkTrees')

const generateType = () => chance.pickone([CST.TYPE_BOOKMARK, CST.TYPE_FOLDER, CST.TYPE_SEPARATOR])

const generateBookmarkInfo = (type) => ({
  id: String(chance.integer({min: 1000, max: 9999})),
  parentId: String(chance.integer({min: 1000, max: 9999})),
  title: chance.word(),
  url: chance.url(),
  iconUrl: chance.url(),
  storageIndex: chance.integer({min: -1, max: 9999}),
  type: type || generateType(),
  isRoot: chance.bool(),
  isUnmodifiable: chance.bool()
})

const generateBookmarkTree = () => ({
  children: R.times(generateBookmarkInfo, 20),
  parent: generateBookmarkInfo(CST.TYPE_FOLDER)
})

export default R.times(generateBookmarkTree, 10)
