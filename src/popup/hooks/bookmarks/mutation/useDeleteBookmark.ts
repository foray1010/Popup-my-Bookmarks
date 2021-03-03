import { useMutation } from 'react-query'
import webExtension from 'webextension-polyfill'

import { BOOKMARK_TYPES } from '../../../constants'
import { getBookmarkInfo } from '../query/useGetBookmarkInfo'
import clearBookmarkCache from './utils/clearBookmarkCache'

export default function useDeleteBookmark() {
  return useMutation(
    async ({ id }: { id: string }) => {
      const bookmarkInfo = await getBookmarkInfo(id)

      if (bookmarkInfo.type === BOOKMARK_TYPES.FOLDER) {
        await webExtension.bookmarks.remove(id)
      } else {
        await webExtension.bookmarks.removeTree(id)
      }

      return { parentId: bookmarkInfo.parentId }
    },
    {
      async onSuccess({ parentId }, { id }) {
        await clearBookmarkCache({ id, parentId })
      },
    },
  )
}
