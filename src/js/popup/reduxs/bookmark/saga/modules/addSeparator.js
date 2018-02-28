// @flow

import type {Saga} from 'redux-saga'
import {call} from 'redux-saga/effects'

import {createBookmark} from '../../../../../common/functions'
import * as CST from '../../../../constants'

type Payload = {|
  index: number,
  parentId: string
|}
export function* addSeparator({parentId, index}: Payload): Saga<void> {
  try {
    yield call(createBookmark, {
      index,
      parentId,
      title: '- '.repeat(42),
      url: CST.SEPARATE_THIS_URL
    })
  } catch (err) {
    console.error(err)
  }
}
