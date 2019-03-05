import {SagaIterator} from 'redux-saga'
import {put} from 'redux-saga/effects'

import * as uiCreators from '../../../ui/actions'

export function* closeMenu(): SagaIterator {
  yield put(uiCreators.setIsDisableGlobalKeyboardEvent(false))
}
