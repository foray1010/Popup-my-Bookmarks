import Chance from 'chance'
import * as R from 'ramda'

import * as CST from '../../../../constants'

const chance = Chance('bookmarkTrees')

const generateType = () =>
  chance.pickone([
    CST.BOOKMARK_TYPES.BOOKMARK,
    CST.BOOKMARK_TYPES.FOLDER,
    CST.BOOKMARK_TYPES.SEPARATOR
  ])

const generateBookmarkInfo = (type?: CST.BOOKMARK_TYPES) => ({
  id: String(chance.integer({min: 1000, max: 9999})),
  parentId: String(chance.integer({min: 1000, max: 9999})),
  title: chance.word(),
  url: chance.url(),
  iconUrl: chance.url(),
  storageIndex: chance.integer({min: -1, max: 9999}),
  type: type || generateType(),
  isRoot: chance.bool(),
  isSimulated: false,
  isUnmodifiable: chance.bool()
})

export const generateBookmarkTree = () => ({
  children: R.times(() => generateBookmarkInfo(), 20),
  parent: generateBookmarkInfo(CST.BOOKMARK_TYPES.FOLDER)
})

export default R.times(generateBookmarkTree, 10)
