import * as React from 'react'

import { ROOT_ID } from '../../../constants'
import { getBookmarkInfo } from '../../../modules/bookmarks/methods/getBookmark'
import type { BookmarkInfo } from '../../../types'

interface Arg {
  isSearching: boolean
  isShowTooltip: boolean
  bookmarkInfo: BookmarkInfo
}

async function getBreadcrumbs(id?: string): Promise<Array<string>> {
  if (!id || id === ROOT_ID) return []

  const bookmarkInfo = await getBookmarkInfo(id)

  return [...(await getBreadcrumbs(bookmarkInfo.parentId)), bookmarkInfo.title]
}

async function getTooltip({
  isSearching,
  isShowTooltip,
  bookmarkInfo,
}: Arg): Promise<string> {
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
}: Arg): string | undefined {
  const [tooltip, setTooltip] = React.useState<string>()

  React.useEffect(() => {
    getTooltip({ isSearching, isShowTooltip, bookmarkInfo })
      .then(setTooltip)
      .catch(console.error)
  }, [bookmarkInfo, isSearching, isShowTooltip])

  return tooltip
}
