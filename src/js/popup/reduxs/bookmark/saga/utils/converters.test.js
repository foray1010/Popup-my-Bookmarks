import Chance from 'chance'

import * as CST from '../../../../constants'
import * as converters from './converters'

const chance = new Chance('converters')

describe('getIconUrl', () => {
  test('return bookmark url if it is bookmark', () => {
    const url = chance.url()
    expect(
      converters.getIconUrl({
        type: CST.TYPE_BOOKMARK,
        url
      })
    ).toBe(`chrome://favicon/${url}`)
  })

  test('return folder icon if it is folder', () => {
    expect(
      converters.getIconUrl({
        type: CST.TYPE_FOLDER
      })
    ).toBe('test-file-stub')
  })

  test('return empty string if it is neither bookmark nor folder', () => {
    expect(
      converters.getIconUrl({
        type: CST.TYPE_SEPARATOR
      })
    ).toBe('')
  })
})

describe('getType', () => {
  test('return folder type if url does not exist', () => {
    expect(converters.getType({})).toBe(CST.TYPE_FOLDER)

    expect(converters.getType({url: ''})).toBe(CST.TYPE_FOLDER)
  })

  test('return separate type if domain is separatethis.com', () => {
    expect(
      converters.getType({
        url: 'http://separatethis.com/'
      })
    ).toBe(CST.TYPE_SEPARATOR)

    expect(
      converters.getType({
        url: 'http://separatethis.com/solid.html'
      })
    ).toBe(CST.TYPE_SEPARATOR)
  })

  test('return bookmark type if url is set and it is not from separatethis.com', () => {
    expect(
      converters.getType({
        url: 'http://google.com/'
      })
    ).toBe(CST.TYPE_BOOKMARK)
  })
})

describe('isRoot', () => {
  test("is root if it's id equal to ROOT_ID", () => {
    expect(
      converters.isRoot({
        id: CST.ROOT_ID
      })
    ).toBe(true)

    expect(
      converters.isRoot({
        id: CST.ROOT_ID + String(chance.integer())
      })
    ).toBe(false)
  })

  test("is root if it's parentId equal to ROOT_ID", () => {
    expect(
      converters.isRoot({
        parentId: CST.ROOT_ID
      })
    ).toBe(true)

    expect(
      converters.isRoot({
        parentId: CST.ROOT_ID + String(chance.integer())
      })
    ).toBe(false)
  })
})

describe('simulateBookmark', () => {
  test('always overwrite target values', () => {
    const id = String(chance.integer())
    const type = chance.pickone([CST.TYPE_BOOKMARK, CST.TYPE_FOLDER, CST.TYPE_SEPARATOR])
    expect(
      converters.simulateBookmark({
        id,
        isRoot: true,
        isUnmodifiable: false,
        parentId: String(chance.integer()),
        storageIndex: chance.integer({min: 0}),
        title: chance.word(),
        type,
        url: chance.url()
      })
    ).toEqual({
      id,
      isRoot: false,
      isUnmodifiable: true,
      parentId: '',
      storageIndex: -1,
      title: '',
      type,
      url: ''
    })
  })
})

describe('toBookmark', () => {
  test('convert bookmarkNode to bookmarkInfo', () => {
    expect(
      converters.toBookmark({
        id: '123',
        index: 1,
        parentId: '234',
        title: 'fake-title',
        unmodifiable: 'managed',
        url: 'http://google.com'
      })
    ).toEqual({
      iconUrl: 'chrome://favicon/http://google.com',
      id: '123',
      isRoot: false,
      isUnmodifiable: true,
      parentId: '234',
      storageIndex: 1,
      title: 'fake-title',
      type: 'bookmark',
      url: 'http://google.com'
    })
  })

  test('should fill default value', () => {
    expect(
      converters.toBookmark({
        id: '123',
        title: 'fake-title'
      })
    ).toEqual({
      iconUrl: 'test-file-stub',
      id: '123',
      isRoot: false,
      isUnmodifiable: false,
      parentId: '',
      storageIndex: -1,
      title: 'fake-title',
      type: 'folder',
      url: ''
    })
  })

  test('if it is root, it must be unmodifiable', () => {
    expect(
      converters.toBookmark({
        id: '123',
        parentId: CST.ROOT_ID,
        title: 'fake-title'
      })
    ).toEqual({
      iconUrl: 'test-file-stub',
      id: '123',
      isRoot: true,
      isUnmodifiable: true,
      parentId: CST.ROOT_ID,
      storageIndex: -1,
      title: 'fake-title',
      type: 'folder',
      url: ''
    })
  })
})
