/* eslint redux-saga/no-unhandled-errors: 'off' */

import * as R from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import bookmarkTrees from '../__fixtures__/bookmarkTrees'
import optionsFixture from '../../../../../core/__fixtures__/options.json'
import { OPTIONS } from '../../../../constants'
import { LastPosition } from '../../../../types/localStorage'
import * as bookmarkCreators from '../../actions'
import { getBookmarkTrees } from '../utils/getters'
import { getRememberedTreeIds, initBookmarkTrees } from './initBookmarkTrees'

describe('getRememberedTreeIds', () => {
  test('return ids if options[OPTIONS.REMEMBER_POS] is true', () => {
    const lastPositions = [
      {
        id: 'a',
        scrollTop: 0,
      },
    ]
    const options = {
      ...optionsFixture,
      [OPTIONS.REMEMBER_POS]: true,
    }

    expect(getRememberedTreeIds({ lastPositions, options })).toStrictEqual([
      'a',
    ])
  })

  test('empty array if lastPositions is not defined', () => {
    const lastPositions: Array<LastPosition> = []
    const options = {
      ...optionsFixture,
      [OPTIONS.REMEMBER_POS]: true,
    }

    expect(getRememberedTreeIds({ lastPositions, options })).toStrictEqual([])
  })

  test('empty array if options[OPTIONS.REMEMBER_POS] is false', () => {
    const lastPositions = [
      {
        id: 'a',
        scrollTop: 0,
      },
    ]
    const options = {
      ...optionsFixture,
      [OPTIONS.REMEMBER_POS]: false,
    }

    expect(getRememberedTreeIds({ lastPositions, options })).toStrictEqual([])
  })
})

describe('initBookmarkTrees', () => {
  test('get extra trees if rememberPos is `true`', () => {
    const generator = initBookmarkTrees()

    expect(generator.next().value).toStrictEqual(select(R.identity))

    const lastPositions = [
      {
        id: 'a',
        scrollTop: 0,
      },
      {
        id: 'b',
        scrollTop: 0,
      },
    ]
    const options = {
      ...optionsFixture,
      [OPTIONS.REMEMBER_POS]: true,
    }
    // @ts-ignore
    expect(generator.next({ lastPositions, options }).value).toStrictEqual(
      call(getBookmarkTrees, ['b'], options),
    )

    // @ts-ignore
    expect(generator.next(bookmarkTrees).value).toStrictEqual(
      put(bookmarkCreators.setBookmarkTrees(bookmarkTrees)),
    )

    expect(generator.next().done).toBe(true)
  })
})
