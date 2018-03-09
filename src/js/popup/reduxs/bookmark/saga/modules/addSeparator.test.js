import Chance from 'chance'
import {call} from 'redux-saga/effects'

import {createBookmark} from '../../../../../common/utils'
import * as CST from '../../../../constants'
import {addSeparator} from './addSeparator'

const chance = new Chance('addSeparator')

describe('addSeparator', () => {
  test('should successfully add separator', () => {
    const index = chance.integer()
    const parentId = String(chance.integer())

    const generator = addSeparator({parentId, index})

    expect(generator.next().value).toEqual(
      call(createBookmark, {
        index,
        parentId,
        title: '- '.repeat(42),
        url: CST.SEPARATE_THIS_URL
      })
    )

    expect(generator.next().done).toBe(true)
  })
})
