import type { BookmarkInfo } from '../types'

export default function sortByTitle(
  bookmarkInfos: readonly BookmarkInfo[],
): BookmarkInfo[] {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  })
  return Array.from(bookmarkInfos).sort((a, b) =>
    collator.compare(a.title, b.title),
  )
}
