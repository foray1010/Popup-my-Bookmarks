import { useMutation } from 'react-query'
import webExtension from 'webextension-polyfill'

import { queryClient } from '../../../../core/utils/queryClient'
import { BOOKMARK_TYPES } from '../../../constants'
import { queryKey } from '../constants'
import { getBookmarkInfo } from '../query/useGetBookmarkInfo'

export default function useDeleteBookmark() {
  return useMutation(
    async ({ id }: { id: string }) => {
      const bookmarkInfo = await getBookmarkInfo(id)

      if (bookmarkInfo.type === BOOKMARK_TYPES.FOLDER) {
        await webExtension.bookmarks.remove(id)
      } else {
        await webExtension.bookmarks.removeTree(id)
      }
    },
    {
      async onSuccess(_, { id }) {
        await queryClient.invalidateQueries([queryKey, id])
      },
    },
  )
}
