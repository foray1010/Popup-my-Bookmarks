import Chance from 'chance'
import {call} from 'redux-saga/effects'
import {cloneableGenerator} from 'redux-saga/utils'

import {removeBookmark, removeBookmarkTree} from '../../../../../common/utils'
import * as CST from '../../../../constants'
import bookmarkTrees from '../__fixtures__/bookmarkTrees'
import {getBookmarkInfo} from '../utils/getters'
import {deleteBookmark} from './deleteBookmark'

const chance = new Chance('deleteBookmark')

describe('deleteBookmark', () => {
  const id = String(chance.integer())
  let generator

  beforeAll(() => {
    generator = cloneableGenerator(deleteBookmark)({id})

    expect(generator.next().value).toEqual(call(getBookmarkInfo, id))
  })

  test('should delete bookmark', () => {
    const clonedGenerator = generator.clone()

    const bookmarkInfo = {
      ...bookmarkTrees[0].children[0],
      type: CST.TYPE_BOOKMARK
    }
    expect(clonedGenerator.next(bookmarkInfo).value).toEqual(call(removeBookmark, id))

    expect(clonedGenerator.next().done).toBe(true)
  })

  test('should delete folder recursively', () => {
    const clonedGenerator = generator.clone()

    const bookmarkInfo = {
      ...bookmarkTrees[0].children[0],
      type: CST.TYPE_FOLDER
    }
    expect(clonedGenerator.next(bookmarkInfo).value).toEqual(call(removeBookmarkTree, id))

    expect(clonedGenerator.next().done).toBe(true)
  })
})
