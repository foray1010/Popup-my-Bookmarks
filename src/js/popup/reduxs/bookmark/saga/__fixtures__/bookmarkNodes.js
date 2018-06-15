// @flow strict

import Chance from 'chance'
import * as R from 'ramda'

const chance = Chance('bookmarkNodes')

const generateBookmarkNode = () => ({
  id: String(chance.integer({min: 1000, max: 9999})),
  ...(chance.bool() ? {parentId: String(chance.integer({min: 1000, max: 9999}))} : null),
  ...(chance.bool() ? {index: chance.integer({min: 1000, max: 9999})} : null),
  ...(chance.bool() ? {url: chance.url()} : null),
  title: chance.word(),
  ...(chance.bool() ?
    {dateAdded: chance.integer({min: 1500000000000, max: 2000000000000})} :
    null),
  ...(chance.bool() ?
    {
      dateGroupModified: chance.integer({min: 1500000000000, max: 2000000000000})
    } :
    null),
  ...(chance.bool() ? {unmodifiable: chance.word()} : null)
})

export default R.times(generateBookmarkNode, 100)
