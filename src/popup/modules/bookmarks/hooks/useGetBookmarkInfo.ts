import { useQuery } from '@tanstack/react-query'

import { getBookmarkInfo } from '../methods/getBookmark.js'
import type { BookmarkInfo } from '../types.js'
import { queryKey } from './constants/reactQuery.js'

export default function useGetBookmarkInfo(id?: string) {
  return useQuery({
    queryKey: [queryKey, id],
    async queryFn(): Promise<BookmarkInfo> {
      if (id === undefined) throw new TypeError('id is required')
      return await getBookmarkInfo(id)
    },
    enabled: id !== undefined,
  })
}
