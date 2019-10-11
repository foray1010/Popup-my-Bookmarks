import Chance from 'chance'

import * as CST from '../../../constants'
import bookmarkNodes from '../saga/__fixtures__/bookmarkNodes'
import bookmarkTrees from '../saga/__fixtures__/bookmarkTrees'
import * as converters from './converters'

const chance = Chance('converters')

const templateBookmarkInfo = bookmarkTrees[0].children[0]

describe('getIconUrl', () => {
  test('return bookmark url if it is bookmark', () => {
    const url = chance.url()
    expect(
      converters.getIconUrl({
        ...templateBookmarkInfo,
        type: CST.BOOKMARK_TYPES.BOOKMARK,
        url,
      }),
    ).toBe(`chrome://favicon/${url}`)
  })
  test('return folder icon if it is folder', () => {
    expect(
      converters.getIconUrl({
        ...templateBookmarkInfo,
        type: CST.BOOKMARK_TYPES.FOLDER,
      }),
    ).toBe('test-file-stub')
  })
  test('return empty string if it is neither bookmark nor folder', () => {
    expect(
      converters.getIconUrl({
        ...templateBookmarkInfo,
        type: CST.BOOKMARK_TYPES.SEPARATOR,
      }),
    ).toBe('')
  })
})

describe('getType', () => {
  test('return folder type if url does not exist', () => {
    expect(
      converters.getType({
        ...bookmarkNodes[0],
        url: undefined,
      }),
    ).toBe(CST.BOOKMARK_TYPES.FOLDER)
  })
  test('return separate type if domain is separatethis.com', () => {
    expect(
      converters.getType({
        ...bookmarkNodes[0],
        url: 'http://separatethis.com/',
      }),
    ).toBe(CST.BOOKMARK_TYPES.SEPARATOR)

    expect(
      converters.getType({
        ...bookmarkNodes[0],
        url: 'http://separatethis.com/solid.html',
      }),
    ).toBe(CST.BOOKMARK_TYPES.SEPARATOR)
  })
  test('return bookmark type if url is set and it is not from separatethis.com', () => {
    expect(
      converters.getType({
        ...bookmarkNodes[0],
        url: 'http://google.com/',
      }),
    ).toBe(CST.BOOKMARK_TYPES.BOOKMARK)
  })
})

describe('isRoot', () => {
  test("is root if it's id equal to ROOT_ID", () => {
    expect(
      converters.isRoot({
        ...bookmarkNodes[0],
        id: CST.ROOT_ID,
      }),
    ).toBe(true)

    expect(
      converters.isRoot({
        ...bookmarkNodes[0],
        id: CST.ROOT_ID + String(chance.integer()),
      }),
    ).toBe(false)
  })
  test("is root if it's parentId equal to ROOT_ID", () => {
    expect(
      converters.isRoot({
        ...bookmarkNodes[0],
        parentId: CST.ROOT_ID,
      }),
    ).toBe(true)

    expect(
      converters.isRoot({
        ...bookmarkNodes[0],
        parentId: CST.ROOT_ID + String(chance.integer()),
      }),
    ).toBe(false)
  })
})

describe('simulateBookmark', () => {
  test('always overwrite target values', () => {
    const id = String(chance.integer())
    const parentId = String(chance.integer())
    const title = chance.word()
    const type = chance.pickone([
      CST.BOOKMARK_TYPES.BOOKMARK,
      CST.BOOKMARK_TYPES.FOLDER,
      CST.BOOKMARK_TYPES.SEPARATOR,
    ])
    expect(
      converters.simulateBookmark({
        iconUrl: chance.url(),
        id,
        isRoot: true,
        isSimulated: false,
        isUnmodifiable: false,
        parentId,
        storageIndex: chance.integer({ min: 0 }),
        title,
        type,
        url: chance.url(),
      }),
    ).toEqual({
      iconUrl: '',
      id,
      isRoot: false,
      isSimulated: true,
      isUnmodifiable: true,
      parentId,
      storageIndex: -1,
      title,
      type,
      url: '',
    })
  })
})

describe('toBookmarkInfo', () => {
  test('convert bookmarkNode to bookmarkInfo', () => {
    expect(
      converters.toBookmarkInfo({
        id: '123',
        index: 1,
        parentId: '234',
        title: 'fake-title',
        unmodifiable: 'managed',
        url: 'http://google.com',
      }),
    ).toEqual({
      iconUrl: 'chrome://favicon/http://google.com',
      id: '123',
      isRoot: false,
      isSimulated: false,
      isUnmodifiable: true,
      parentId: '234',
      storageIndex: 1,
      title: 'fake-title',
      type: CST.BOOKMARK_TYPES.BOOKMARK,
      url: 'http://google.com',
    })
  })
  test('should fill default value', () => {
    expect(
      converters.toBookmarkInfo({
        id: '123',
        title: 'fake-title',
      }),
    ).toEqual({
      iconUrl: 'test-file-stub',
      id: '123',
      isRoot: false,
      isSimulated: false,
      isUnmodifiable: false,
      parentId: '',
      storageIndex: -1,
      title: 'fake-title',
      type: CST.BOOKMARK_TYPES.FOLDER,
      url: '',
    })
  })
  test('if it is root, it must be unmodifiable', () => {
    expect(
      converters.toBookmarkInfo({
        id: '123',
        parentId: CST.ROOT_ID,
        title: 'fake-title',
      }),
    ).toEqual({
      iconUrl: 'test-file-stub',
      id: '123',
      isRoot: true,
      isSimulated: false,
      isUnmodifiable: true,
      parentId: CST.ROOT_ID,
      storageIndex: -1,
      title: 'fake-title',
      type: CST.BOOKMARK_TYPES.FOLDER,
      url: '',
    })
  })
})
