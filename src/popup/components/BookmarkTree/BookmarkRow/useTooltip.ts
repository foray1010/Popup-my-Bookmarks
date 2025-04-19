import { useEffect, useState } from 'react'

import { ROOT_ID } from '@/core/constants/index.js'
import { getBookmarkInfo } from '@/popup/modules/bookmarks/methods/getBookmark.js'
import type { BookmarkInfo } from '@/popup/modules/bookmarks/types.js'

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

  const [breadcrumbs, setBreadcrumbs] = useState<readonly string[]>([])

  useEffect(() => {
    if (!isSearching) return

    const abortController = new AbortController()

    getBreadcrumbs(bookmarkInfo.parentId)
      .then((tooltip) => {
        if (abortController.signal.aborted) return true

        setBreadcrumbs(tooltip)
      })
      .catch(console.error)

    return () => {
      abortController.abort()
    }
  }, [bookmarkInfo, isSearching])

  if (isSearching && breadcrumbs.length > 0) {
    return joinLines([tooltip, `[${breadcrumbs.join(' > ')}]`])
  }

  return tooltip
}
