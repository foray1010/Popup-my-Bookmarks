import type { BookmarkInfo } from '../types/index.js'

export default function sortByTitle(
  bookmarkInfos: readonly BookmarkInfo[],
): readonly BookmarkInfo[] {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  })
  return Array.from(bookmarkInfos).sort((a, b) =>
    collator.compare(a.title, b.title),
  )
}
