import {all, call, put, select, takeLatest} from 'redux-saga/effects'
import webExtension from 'webextension-polyfill'

import getOptionsConfig from '../../common/lib/getOptionsConfig'
import {initOptionsValue} from '../functions'
import {Creators as optionsCreators, Types as optionsTypes} from '../reduxs/optionsRedux'

// workaround as following functions cannot pass redux-saga
// and throw error: `TypeError: Function.prototype.toString requires that 'this' be a Function`
const clearStorage = (...args) => webExtension.storage.sync.clear(...args)
const setStorage = (...args) => webExtension.storage.sync.set(...args)
const getStorage = (...args) => webExtension.storage.sync.get(...args)

const updateOptions = (options) => put(optionsCreators.updateOptions(options))

export function* reloadOptions() {
  const options = yield call(getStorage, null)

  yield updateOptions(options)
}

function* resetToDefaultOptions() {
  yield call(clearStorage)

  const optionsConfig = yield call(getOptionsConfig)
  const options = yield call(initOptionsValue, optionsConfig)

  yield updateOptions(options)
}

function* saveOptions() {
  const {options} = yield select()

  yield call(setStorage, options)

  yield updateOptions(options)
}

export default function* optionsSaga() {
  yield all([
    takeLatest(optionsTypes.RELOAD_OPTIONS, reloadOptions),
    takeLatest(optionsTypes.RESET_TO_DEFAULT_OPTIONS, resetToDefaultOptions),
    takeLatest(optionsTypes.SAVE_OPTIONS, saveOptions)
  ])
}
