import {all, call, put, select, takeLatest} from 'redux-saga/effects'
import webExtension from 'webextension-polyfill'

import {initOptions} from '../../functions'
import {optionsCreators, optionsTypes} from './actions'

// workaround as following functions cannot pass redux-saga
// and throw error: `TypeError: Function.prototype.toString requires that 'this' be a Function`
const clearStorage = (...args) => webExtension.storage.sync.clear(...args)
const setStorage = (...args) => webExtension.storage.sync.set(...args)
const getStorage = (...args) => webExtension.storage.sync.get(...args)

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
