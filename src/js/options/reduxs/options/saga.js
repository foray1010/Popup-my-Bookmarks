// @flow strict

import * as R from 'ramda'
import type {Saga} from 'redux-saga'
import {all, call, put, select, takeLatest} from 'redux-saga/effects'

import type {Options} from '../../../common/types/options'
import {clearStorage, getStorage, setStorage, silenceSaga} from '../../../common/utils'
import {initOptions} from '../../utils'
import {optionsCreators, optionsTypes} from './actions'

const updateOptions = (options: Options) => put(optionsCreators.updateOptions(options))

function* reloadOptions(): Saga<void> {
  const options = yield call(getStorage, null)

  yield updateOptions(options)
}

function* resetToDefaultOptions(): Saga<void> {
  yield call(clearStorage)

  const options = yield call(initOptions)

  yield updateOptions(options)
}

function* saveOptions(): Saga<void> {
  const {options} = yield select(R.identity)

  yield call(setStorage, options)

  yield updateOptions(options)
}

export function* optionsSaga(): Saga<void> {
  yield all([
    takeLatest(optionsTypes.RELOAD_OPTIONS, silenceSaga(reloadOptions)),
    takeLatest(optionsTypes.RESET_TO_DEFAULT_OPTIONS, silenceSaga(resetToDefaultOptions)),
    takeLatest(optionsTypes.SAVE_OPTIONS, silenceSaga(saveOptions))
  ])
}
