import * as React from 'react'

import { ROOT_ID } from '../../../constants/index.js'
import { getBookmarkInfo } from '../../../modules/bookmarks/methods/getBookmark.js'
import type { BookmarkInfo } from '../../../types/index.js'

async function getBreadcrumbs(
  id: string | undefined,
): Promise<readonly string[]> {
  if (!id || id === ROOT_ID) return []

  const bookmarkInfo = await getBookmarkInfo(id)

  const parentBreadcrumbs = await getBreadcrumbs(bookmarkInfo.parentId)
  return parentBreadcrumbs.concat(bookmarkInfo.title)
}

const joinLines = (lines: ReadonlyArray<string | undefined>): string =>
  lines.filter(Boolean).join('\n')

export default function useTooltip({
  bookmarkInfo,
  isSearching,
  isShowTooltip,
}: {
  readonly bookmarkInfo: BookmarkInfo
  readonly isSearching: boolean
  readonly isShowTooltip: boolean
}): string | undefined {
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
