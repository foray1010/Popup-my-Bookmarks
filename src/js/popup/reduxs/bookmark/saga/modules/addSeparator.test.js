// @flow strict

import Chance from 'chance'
import {put} from 'redux-saga/effects'

import * as CST from '../../../../constants'
import {bookmarkCreators, bookmarkTypes} from '../../actions'
import {addSeparator} from './addSeparator'

const chance = Chance('addSeparator')

describe('addSeparator', () => {
  test('should successfully add separator', () => {
    const index = chance.integer()
    const parentId = String(chance.integer())

    const generator = addSeparator({
      type: bookmarkTypes.ADD_SEPARATOR,
      payload: {parentId, index}
    })

    expect(generator.next().value).toEqual(
      put(bookmarkCreators.createBookmark(parentId, index, '- '.repeat(42), CST.SEPARATE_THIS_URL))
    )

    expect(generator.next().done).toBe(true)
  })
})
