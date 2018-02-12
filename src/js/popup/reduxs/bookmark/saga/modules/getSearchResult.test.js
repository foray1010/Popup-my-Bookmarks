const {put} = require('redux-saga/effects')

const {bookmarkCreators} = require('../../actions')
const {getSearchResult} = require('./getSearchResult')

describe('getSearchResult', () => {
  test('put `initBookmarkTrees` action if `searchKeyword` is empty', () => {
    const searchKeyword = ''

    const generator = getSearchResult({searchKeyword})

    expect(generator.next().value).toEqual(put(bookmarkCreators.initBookmarkTrees()))

    expect(generator.next().done).toBe(true)
  })
})
