/* eslint max-lines: 'off' */

import {cloneableGenerator} from '@redux-saga/testing-utils'
import Chance from 'chance'
import * as R from 'ramda'
import {all, call} from 'redux-saga/effects'

import optionsFixture from '../../../../../common/__fixtures__/options.json'
import {
  getBookmarkChildNodes,
  getBookmarkNodes,
  searchBookmarkNodes
} from '../../../../../common/utils'
import * as CST from '../../../../constants'
import {BookmarkTree} from '../../../../types'
import bookmarkNodes from '../__fixtures__/bookmarkNodes'
import bookmarkTrees from '../__fixtures__/bookmarkTrees'
import * as getters from './getters'

const chance = Chance('getters')

describe('getBookmarkInfo', () => {
  test('should get the first bookmark node by id and convert it to bookmarkInfo', () => {
    const generator = getters.getBookmarkInfo(bookmarkNodes[0].id)

    expect(generator.next().value).toEqual(call(getBookmarkNodes, bookmarkNodes[0].id))

    expect(generator.next(bookmarkNodes).value).toMatchSnapshot()

    expect(generator.next().done).toBe(true)
  })
})

describe('getBookmarkChildren', () => {
  test('should get all its children by id and convert all children to bookmarkInfo', () => {
    const generator = getters.getBookmarkChildren(bookmarkNodes[0].id)

    expect(generator.next().value).toEqual(call(getBookmarkChildNodes, bookmarkNodes[0].id))

    expect(generator.next([bookmarkNodes[1], bookmarkNodes[2]]).value).toMatchSnapshot()

    expect(generator.next().done).toBe(true)
  })
})

describe('getBookmarkTree', () => {
  test('get parent and children data at once', () => {
    const generator = getters.getBookmarkTree(bookmarkNodes[0].id)

    expect(generator.next().value).toEqual(
      all([
        call(getters.getBookmarkInfo, bookmarkNodes[0].id),
        call(getters.getBookmarkChildren, bookmarkNodes[0].id)
      ])
    )

    expect(generator.next([bookmarkTrees[0].parent, bookmarkTrees[0].children]).value).toEqual(
      bookmarkTrees[0]
    )

    expect(generator.next().done).toBe(true)
  })
})

describe('getBookmarkTrees', () => {
  // limit to 4 trees, and set parentId to previous tree id
  const correlatedBookmarkTrees = R.take(4, bookmarkTrees).reduce(
    (acc: Array<BookmarkTree>, bookmarkTree) => {
      if (!acc.length) return [bookmarkTree]

      const prevBookmarkTree = R.last(acc)
      if (!prevBookmarkTree) throw new Error('prevBookmarkTree must exist')
      const updatedBookmarkTree = R.set(
        R.lensPath(['parent', 'parentId']),
        prevBookmarkTree.parent.id,
        bookmarkTree
      )
      return [...acc, updatedBookmarkTree]
    },
    []
  )
  const getRestTreeIds = (trees: Array<BookmarkTree>) => R.tail(trees).map((tree) => tree.parent.id)

  const options = optionsFixture
  const restTreeIds = getRestTreeIds(correlatedBookmarkTrees)

  const generator = cloneableGenerator(getters.getBookmarkTrees)(restTreeIds, options)

  expect(generator.next().value).toEqual(
    all([
      call(getters.getFirstBookmarkTree, options),
      ...R.map((id) => call(getters.tryGetBookmarkTree, id), restTreeIds)
    ])
  )

  test('should get all trees', () => {
    const clonedGenerator = generator.clone()

    expect(clonedGenerator.next(correlatedBookmarkTrees).value).toEqual(correlatedBookmarkTrees)

    expect(clonedGenerator.next().done).toBe(true)
  })
  test('should remove tree and its child trees if cannot get that tree', () => {
    for (let i = 1; i < correlatedBookmarkTrees.length; i += 1) {
      const clonedGenerator = generator.clone()

      const partiallyUnrelatedBookmarkTrees = R.set(R.lensIndex(i), null, correlatedBookmarkTrees)
      expect(clonedGenerator.next(partiallyUnrelatedBookmarkTrees).value).toEqual(
        R.take(i, partiallyUnrelatedBookmarkTrees)
      )

      expect(clonedGenerator.next().done).toBe(true)
    }
  })
})
describe('getFirstBookmarkTree', () => {
  test('should get default expanded tree and append root folders to its children except itself', () => {
    const hiddenFolderId = '99999'
    const options = {
      ...optionsFixture,
      defExpand: Number(bookmarkTrees[0].parent.id),
      hideRootFolder: [Number(hiddenFolderId)]
    }

    const generator = getters.getFirstBookmarkTree(options)

    expect(generator.next().value).toEqual(
      all([
        call(getters.getBookmarkTree, String(options.defExpand)),
        call(getters.getBookmarkChildren, CST.ROOT_ID)
      ])
    )

    const rootFolders = [
      {
        ...bookmarkTrees[0].children[0],
        type: CST.BOOKMARK_TYPES.BOOKMARK,
        id: String(chance.integer({min: 2})),
        isRoot: true
      },
      {
        ...bookmarkTrees[0].children[0],
        type: CST.BOOKMARK_TYPES.FOLDER,
        id: String(chance.integer({min: 2})),
        isRoot: true
      },
      {
        ...bookmarkTrees[0].children[0],
        type: CST.BOOKMARK_TYPES.FOLDER,
        id: bookmarkTrees[0].parent.id,
        isRoot: true
      },
      {
        ...bookmarkTrees[0].children[0],
        type: CST.BOOKMARK_TYPES.FOLDER,
        id: hiddenFolderId,
        isRoot: true
      }
    ]
    expect(generator.next([bookmarkTrees[0], rootFolders]).value).toMatchSnapshot()
    expect(generator.next().done).toBe(true)
  })
})

describe('searchBookmarks', () => {
  test('search bookmarks and convert to bookmarkInfo', () => {
    const searchQuery = {query: chance.word()}
    const generator = getters.searchBookmarks(searchQuery)

    expect(generator.next().value).toEqual(call(searchBookmarkNodes, searchQuery))

    expect(generator.next([bookmarkNodes[3], bookmarkNodes[4]]).value).toMatchSnapshot()

    expect(generator.next().done).toBe(true)
  })
})

describe('tryGetBookmarkTree', () => {
  test('run getBookmarkTree', () => {
    const generator = getters.tryGetBookmarkTree(bookmarkNodes[0].id)

    expect(generator.next().value).toEqual(call(getters.getBookmarkTree, bookmarkNodes[0].id))

    expect(generator.next([bookmarkTrees[5]]).value).toEqual([bookmarkTrees[5]])

    expect(generator.next().done).toBe(true)
  })
  test('return null if failed to get bookmark tree', () => {
    const generator = getters.tryGetBookmarkTree(bookmarkNodes[0].id)

    expect(generator.next().value).toEqual(call(getters.getBookmarkTree, bookmarkNodes[0].id))

    // generator.throw should always exists in real world
    if (generator.throw) {
      expect(generator.throw(new Error()).value).toBe(null)
    }

    expect(generator.next().done).toBe(true)
  })
})
