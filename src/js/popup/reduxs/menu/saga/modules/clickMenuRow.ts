import * as R from 'ramda'
import {SagaIterator} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import * as CST from '../../../../constants'
import {BookmarkTree} from '../../../../types'
import * as bookmarkCreators from '../../../bookmark/actions'
import {getBookmarkInfo, getBookmarkTree} from '../../../bookmark/saga/utils/getters'
import * as editorCreators from '../../../editor/actions'
import * as menuCreators from '../../actions'

export function* clickMenuRow({
  payload
}: ActionType<typeof menuCreators.clickMenuRow>): SagaIterator {
  const {menu} = yield select(R.pick(['menu']))

  const targetBookmarkInfo = yield call(getBookmarkInfo, menu.targetId)

  switch (payload.rowName) {
    case CST.MENU_ADD_FOLDER:
      yield put(
        editorCreators.createFolderInEditor(menu.targetId, {
          positionLeft: menu.targetLeft,
          positionTop: menu.targetTop
        })
      )
      break

    case CST.MENU_ADD_PAGE:
      yield put(
        bookmarkCreators.addCurrentPage(
          targetBookmarkInfo.parentId,
          targetBookmarkInfo.storageIndex + 1
        )
      )
      break

    case CST.MENU_ADD_SEPARATOR:
      yield put(
        bookmarkCreators.addSeparator(
          targetBookmarkInfo.parentId,
          targetBookmarkInfo.storageIndex + 1
        )
      )
      break

    case CST.MENU_COPY:
      yield put(bookmarkCreators.copyBookmark(targetBookmarkInfo.id))
      break

    case CST.MENU_CUT:
      yield put(bookmarkCreators.cutBookmark(targetBookmarkInfo.id))
      break

    case CST.MENU_DEL:
      yield put(bookmarkCreators.deleteBookmark(targetBookmarkInfo.id))
      break

    case CST.MENU_EDIT:
    case CST.MENU_RENAME:
      yield put(
        editorCreators.openEditor(menu.targetId, {
          positionLeft: menu.targetLeft,
          positionTop: menu.targetTop
        })
      )
      break

    case CST.MENU_OPEN_ALL:
    case CST.MENU_OPEN_ALL_IN_I:
    case CST.MENU_OPEN_ALL_IN_N: {
      const targetBookmarkTree: BookmarkTree = yield call(getBookmarkTree, targetBookmarkInfo.id)
      const ids = R.pluck('id', targetBookmarkTree.children)

      const mapping = {
        [CST.MENU_OPEN_ALL]: CST.OPEN_IN_TYPES.BACKGROUND_TAB,
        [CST.MENU_OPEN_ALL_IN_I]: CST.OPEN_IN_TYPES.INCOGNITO_WINDOW,
        [CST.MENU_OPEN_ALL_IN_N]: CST.OPEN_IN_TYPES.NEW_WINDOW
      }
      yield put(bookmarkCreators.openBookmarksInBrowser(ids, mapping[payload.rowName], true))
      break
    }

    case CST.MENU_OPEN_IN_B:
    case CST.MENU_OPEN_IN_I:
    case CST.MENU_OPEN_IN_N: {
      const mapping = {
        [CST.MENU_OPEN_IN_B]: CST.OPEN_IN_TYPES.BACKGROUND_TAB,
        [CST.MENU_OPEN_IN_I]: CST.OPEN_IN_TYPES.INCOGNITO_WINDOW,
        [CST.MENU_OPEN_IN_N]: CST.OPEN_IN_TYPES.NEW_WINDOW
      }
      yield put(
        bookmarkCreators.openBookmarksInBrowser(
          [targetBookmarkInfo.id],
          mapping[payload.rowName],
          true
        )
      )
      break
    }

    case CST.MENU_PASTE:
      yield put(
        bookmarkCreators.pasteBookmark(
          targetBookmarkInfo.parentId,
          targetBookmarkInfo.storageIndex + 1
        )
      )
      break

    case CST.MENU_SORT_BY_NAME:
      yield put(bookmarkCreators.sortBookmarksByName(targetBookmarkInfo.parentId))
      break

    default:
  }
}
