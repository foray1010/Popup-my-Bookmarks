import type { BookmarkInfo } from '../types'

export default function sortByTitle(
  bookmarkInfos: BookmarkInfo[],
): BookmarkInfo[] {
  const collator = new Intl.Collator()
  return Array.from(bookmarkInfos).sort((a, b) =>
    collator.compare(a.title, b.title),
  )
}
