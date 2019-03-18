import * as R from 'ramda'
import {call, put, select} from 'redux-saga/effects'

import optionsFixture from '../../../../../common/__fixtures__/options.json'
import * as bookmarkCreators from '../../actions'
import bookmarkTrees from '../__fixtures__/bookmarkTrees'
import {getBookmarkTrees} from '../utils/getters'
import {getRememberedTreeIds, initBookmarkTrees} from './initBookmarkTrees'

describe('getRememberedTreeIds', () => {
  test('return ids if options.rememberPos is true', () => {
    const localStorage = {
      lastPositions: [
        {
          id: 'a',
          scrollTop: 0
        }
      ]
    }
    const options = {
      ...optionsFixture,
      rememberPos: true
    }

    expect(getRememberedTreeIds({localStorage, options})).toStrictEqual(['a'])
  })

  test('empty array if localStorage.lastPositions is not defined', () => {
    const localStorage = {}
    const options = {
      ...optionsFixture,
      rememberPos: true
    }

    expect(getRememberedTreeIds({localStorage, options})).toStrictEqual([])
  })

  test('empty array if options.rememberPos is false', () => {
    const localStorage = {
      lastPositions: [
        {
          id: 'a',
          scrollTop: 0
        }
      ]
    }
    const options = {
      ...optionsFixture,
      rememberPos: false
    }

    expect(getRememberedTreeIds({localStorage, options})).toStrictEqual([])
  })
})

describe('initBookmarkTrees', () => {
  test('get extra trees if rememberPos is `true`', () => {
    const generator = initBookmarkTrees()

    expect(generator.next().value).toStrictEqual(select(R.identity))

    const localStorage = {
      lastPositions: [
        {
          id: 'a',
          scrollTop: 0
        },
        {
          id: 'b',
          scrollTop: 0
        }
      ]
    }
    const options = {
      ...optionsFixture,
      rememberPos: true
    }
    expect(generator.next({localStorage, options}).value).toStrictEqual(
      call(getBookmarkTrees, ['b'], options)
    )

    expect(generator.next(bookmarkTrees).value).toStrictEqual(
      put(bookmarkCreators.setBookmarkTrees(bookmarkTrees))
    )

    expect(generator.next().done).toBe(true)
  })
})
