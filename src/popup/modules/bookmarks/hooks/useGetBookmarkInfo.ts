import { useQuery } from 'react-query'

import type { BookmarkInfo } from '../../../types'
import { getBookmarkInfo } from '../methods/getBookmark'
import { queryKey } from './constants/reactQuery'

export default function useGetBookmarkInfo(id?: string) {
  return useQuery(
    [queryKey, id],
    async (): Promise<BookmarkInfo | undefined> => {
      if (id === undefined) return undefined
      return await getBookmarkInfo(id)
    },
  )
}
