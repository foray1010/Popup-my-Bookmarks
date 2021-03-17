import { useMutation } from 'react-query'
import webExtension from 'webextension-polyfill'

import { toBookmarkInfo } from '../../../reduxs/bookmark/utils/converters'
import clearBookmarkCache from './utils/clearBookmarkCache'

export default function useEditBookmark() {
  return useMutation(
    async ({
      id,
      changes,
    }: {
      id: string
      changes: webExtension.bookmarks._UpdateChanges
    }) => {
      const bookmarkNode = await webExtension.bookmarks.update(id, changes)
      return toBookmarkInfo(bookmarkNode)
    },
    {
      onSuccess: clearBookmarkCache,
    },
  )
}
