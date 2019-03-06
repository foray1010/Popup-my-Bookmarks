import {SagaIterator} from 'redux-saga'
import {put} from 'redux-saga/effects'

import * as uiCreators from '../../../ui/actions'

export function* closeEditor(): SagaIterator {
  yield put(uiCreators.setIsDisableGlobalKeyboardEvent(false))
}
