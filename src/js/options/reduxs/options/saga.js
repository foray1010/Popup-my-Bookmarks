import {all, call, put, select, takeLatest} from 'redux-saga/effects'

import {clearStorage, getStorage, setStorage} from '../../../common/functions'
import {initOptions} from '../../functions'
import {optionsCreators, optionsTypes} from './actions'

const updateOptions = (options) => put(optionsCreators.updateOptions(options))

function* reloadOptions() {
  try {
    const options = yield call(getStorage, null)

    yield updateOptions(options)
  } catch (err) {
    console.error(err)
  }
}

function* resetToDefaultOptions() {
  try {
    yield call(clearStorage)

    const options = yield call(initOptions)

    yield updateOptions(options)
  } catch (err) {
    console.error(err)
  }
}

function* saveOptions() {
  try {
    const {options} = yield select()

    yield call(setStorage, options)

    yield updateOptions(options)
  } catch (err) {
    console.error(err)
  }
}

export function* optionsSaga() {
  yield all([
    takeLatest(optionsTypes.RELOAD_OPTIONS, reloadOptions),
    takeLatest(optionsTypes.RESET_TO_DEFAULT_OPTIONS, resetToDefaultOptions),
    takeLatest(optionsTypes.SAVE_OPTIONS, saveOptions)
  ])
}
