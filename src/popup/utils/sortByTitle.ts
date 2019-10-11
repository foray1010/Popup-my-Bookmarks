import { BookmarkInfo } from '../types'

export default (bookmarkInfos: Array<BookmarkInfo>) => {
  const collator = new Intl.Collator()
  return Array.from(bookmarkInfos).sort((a, b) =>
    collator.compare(a.title, b.title),
  )
}
