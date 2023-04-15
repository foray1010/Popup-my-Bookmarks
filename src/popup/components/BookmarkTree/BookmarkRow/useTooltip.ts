import * as React from 'react'

import { ROOT_ID } from '../../../../core/constants/index.js'
import { getBookmarkInfo } from '../../../modules/bookmarks/methods/getBookmark.js'
import type { BookmarkInfo } from '../../../modules/bookmarks/types.js'

async function getBreadcrumbs(
  id: string | undefined,
): Promise<readonly string[]> {
  if (!id || id === ROOT_ID) return []

  const bookmarkInfo = await getBookmarkInfo(id)

  const parentBreadcrumbs = await getBreadcrumbs(bookmarkInfo.parentId)
  return parentBreadcrumbs.concat(bookmarkInfo.title)
}

function joinLines(lines: ReadonlyArray<string | undefined>): string {
  return lines.filter(Boolean).join('\n')
}

export default function useTooltip({
  bookmarkInfo,
  isSearching,
  isShowTooltip,
}: Readonly<{
  bookmarkInfo: BookmarkInfo
  isSearching: boolean
  isShowTooltip: boolean
}>): string | undefined {
  const tooltip = isShowTooltip
    ? joinLines([bookmarkInfo.title, bookmarkInfo.url])
    : undefined

  const [breadcrumbs, setBreadcrumbs] = React.useState<readonly string[]>([])

  React.useEffect(() => {
    let ignore = false

    if (!isSearching) return

    getBreadcrumbs(bookmarkInfo.parentId)
      .then((tooltip) => {
        if (ignore) return true

        setBreadcrumbs(tooltip)
      })
      .catch(console.error)

    return () => {
      ignore = true
    }
  }, [bookmarkInfo, isSearching])

  if (isSearching && breadcrumbs.length > 0) {
    return joinLines([tooltip, `[${breadcrumbs.join(' > ')}]`])
  }

  return tooltip
}
