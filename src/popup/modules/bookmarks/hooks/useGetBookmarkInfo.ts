import { useQuery } from '@tanstack/react-query'

import type { BookmarkInfo } from '../../../types/index.js'
import { getBookmarkInfo } from '../methods/getBookmark.js'
import { queryKey } from './constants/reactQuery.js'

export default function useGetBookmarkInfo(id?: string) {
  return useQuery(
    [queryKey, id],
    async (): Promise<BookmarkInfo | undefined> => {
      if (id === undefined) return undefined
      return await getBookmarkInfo(id)
    },
  )
}
