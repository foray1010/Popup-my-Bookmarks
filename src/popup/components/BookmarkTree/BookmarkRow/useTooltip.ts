import * as React from 'react'

import { ROOT_ID } from '../../../constants'
import { getBookmarkInfo } from '../../../hooks/bookmarks/query/useGetBookmarkInfo'
import type { BookmarkInfo } from '../../../types'

interface Arg {
  isSearching: boolean
  isShowTooltip: boolean
  bookmarkInfo: BookmarkInfo
}

const getBreadcrumbs = async (id?: string): Promise<Array<string>> => {
  if (!id || id === ROOT_ID) return []

  const bookmarkInfo = await getBookmarkInfo(id)

  return [...(await getBreadcrumbs(bookmarkInfo.parentId)), bookmarkInfo.title]
}

const getTooltip = async ({
  isSearching,
  isShowTooltip,
  bookmarkInfo,
}: Arg) => {
  const tooltipArr: Array<string> = []

  if (isShowTooltip) {
    tooltipArr.push(bookmarkInfo.title, bookmarkInfo.url)
  }

  if (isSearching) {
    const breadcrumbs = await getBreadcrumbs(bookmarkInfo.parentId)
    tooltipArr.unshift(`[${breadcrumbs.join(' > ')}]`)
  }

  return tooltipArr.filter(Boolean).join('\n')
}

export default function useTooltip({
  isSearching,
  isShowTooltip,
  bookmarkInfo,
}: Arg) {
  const [tooltip, setTooltip] = React.useState<string>()

  React.useEffect(() => {
    getTooltip({ isSearching, isShowTooltip, bookmarkInfo })
      .then(setTooltip)
      .catch(console.error)
  }, [bookmarkInfo, isSearching, isShowTooltip])

  return tooltip
}
