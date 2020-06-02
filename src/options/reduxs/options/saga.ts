import * as R from 'ramda'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import type { Options } from '../../../core/types/options'
import {
  clearStorage,
  getSyncStorage,
  setSyncStorage,
} from '../../../core/utils'
import { initOptions } from '../../utils'
import * as optionsCreators from './actions'

function* reloadOptions() {
  try {
    const options: Options = yield call(getSyncStorage)

    yield put(optionsCreators.updateOptions(options))
  } catch (err) {
    console.error(err)
  }
}

function* resetToDefaultOptions() {
  try {
    yield call(clearStorage)

    const options: Options = yield call(initOptions)

    yield put(optionsCreators.updateOptions(options))
  } catch (err) {
    console.error(err)
  }
}

function* saveOptions() {
  try {
    const { options }: { options: Options } = yield select(R.identity)

    yield call(setSyncStorage, options)

    yield put(optionsCreators.updateOptions(options))
  } catch (err) {
    console.error(err)
  }
}

export function* optionsSaga() {
  yield takeLatest(getType(optionsCreators.reloadOptions), reloadOptions)
  yield takeLatest(
    getType(optionsCreators.resetToDefaultOptions),
    resetToDefaultOptions,
  )
  yield takeLatest(getType(optionsCreators.saveOptions), saveOptions)
}
