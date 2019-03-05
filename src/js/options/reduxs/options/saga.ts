import * as R from 'ramda'
import {SagaIterator} from 'redux-saga'
import {all, call, put, select, takeLatest} from 'redux-saga/effects'
import {getType} from 'typesafe-actions'

import {Options} from '../../../common/types/options'
import {clearStorage, getStorage, setStorage, silenceSaga} from '../../../common/utils'
import {initOptions} from '../../utils'
import * as optionsCreators from './actions'

function* reloadOptions(): SagaIterator {
  const options: Options = yield call(getStorage)

  yield put(optionsCreators.updateOptions(options))
}

function* resetToDefaultOptions(): SagaIterator {
  yield call(clearStorage)

  const options: Options = yield call(initOptions)

  yield put(optionsCreators.updateOptions(options))
}

function* saveOptions(): SagaIterator {
  const {options}: {options: Options} = yield select(R.identity)

  yield call(setStorage, options)

  yield put(optionsCreators.updateOptions(options))
}

export function* optionsSaga(): SagaIterator {
  yield all([
    takeLatest(getType(optionsCreators.reloadOptions), silenceSaga(reloadOptions)),
    takeLatest(getType(optionsCreators.resetToDefaultOptions), silenceSaga(resetToDefaultOptions)),
    takeLatest(getType(optionsCreators.saveOptions), silenceSaga(saveOptions))
  ])
}
