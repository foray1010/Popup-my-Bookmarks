import { useQuery } from 'react-query'
import webExtension from 'webextension-polyfill'

import { NO_BOOKMARK_ID_PREFIX } from '../../../constants'
import type { BookmarkInfo } from '../../../types'
import { queryKey } from '../constants'
import { generateNoBookmarkPlaceholder } from '../utils/generators'
import { toBookmarkInfo } from '../utils/transformers'

export async function getBookmarkInfo(id: string): Promise<BookmarkInfo> {
  if (id.startsWith(NO_BOOKMARK_ID_PREFIX)) {
    return generateNoBookmarkPlaceholder(id.replace(NO_BOOKMARK_ID_PREFIX, ''))
  }

  const [bookmarkNode] = await webExtension.bookmarks.get(id)
  return toBookmarkInfo(bookmarkNode)
}

export function useGetBookmarkInfo(id?: string) {
  return useQuery(
    [queryKey, id],
    async (): Promise<BookmarkInfo | undefined> => {
      if (id === undefined) return undefined
      return await getBookmarkInfo(id)
    },
  )
}
