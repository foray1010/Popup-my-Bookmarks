import * as R from 'ramda'
import {call, put, select} from 'redux-saga/effects'
import store from 'store'

import {bookmarkCreators} from '../../actions'
import bookmarkTrees from '../__fixtures__/bookmarkTrees'
import {getBookmarkTrees} from '../utils/getters'
import {initBookmarkTrees} from './initBookmarkTrees'

describe('initBookmarkTrees', () => {
  test('get extra trees if rememberPos is `true`', () => {
    const generator = initBookmarkTrees()

    expect(generator.next().value).toEqual(select(R.identity))

    const options = {
      rememberPos: true
    }
    expect(generator.next({options}).value).toEqual(call([store, store.get], 'lastBoxPID'))

    const treeIds = ['1', '2', '3']
    expect(generator.next(treeIds).value).toEqual(call(getBookmarkTrees, treeIds, options))

    expect(generator.next(bookmarkTrees).value).toEqual(
      put(bookmarkCreators.setBookmarkTrees(bookmarkTrees))
    )

    expect(generator.next().done).toBe(true)
  })

  test('empty array if store.get return falsy result', () => {
    const generator = initBookmarkTrees()

    expect(generator.next().value).toEqual(select(R.identity))

    const options = {
      rememberPos: true
    }
    expect(generator.next({options}).value).toEqual(call([store, store.get], 'lastBoxPID'))

    expect(generator.next().value).toEqual(call(getBookmarkTrees, [], options))

    expect(generator.next(bookmarkTrees).value).toEqual(
      put(bookmarkCreators.setBookmarkTrees(bookmarkTrees))
    )

    expect(generator.next().done).toBe(true)
  })

  test('do not get extra trees if rememberPos is `false`', () => {
    const generator = initBookmarkTrees()

    expect(generator.next().value).toEqual(select(R.identity))

    const options = {
      rememberPos: false
    }
    expect(generator.next({options}).value).toEqual(call(getBookmarkTrees, [], options))

    expect(generator.next(bookmarkTrees).value).toEqual(
      put(bookmarkCreators.setBookmarkTrees(bookmarkTrees))
    )

    expect(generator.next().done).toBe(true)
  })
})
