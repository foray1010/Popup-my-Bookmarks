import type { BOOKMARK_TYPES } from './constants.js'

export type BookmarkInfo = Readonly<
  {
    id: string
    isRoot: boolean
    isSimulated: boolean
    isUnmodifiable: boolean
    parentId?: string | undefined
    storageIndex: number
    title: string
  } & (
    | {
        type: BOOKMARK_TYPES.BOOKMARK
        iconUrl: string
        url: string
      }
    | {
        type: BOOKMARK_TYPES.DRAG_INDICATOR
        iconUrl?: never
        url?: never
      }
    | {
        type: BOOKMARK_TYPES.FOLDER
        iconUrl: string
        url?: never
      }
    | {
        type: BOOKMARK_TYPES.NO_BOOKMARK
        iconUrl?: never
        url?: never
      }
    | {
        type: BOOKMARK_TYPES.SEPARATOR
        iconUrl?: never
        url: string
      }
  )
>

export type BookmarkTreeInfo = Readonly<{
  children: ReadonlyArray<BookmarkInfo>
  parent: BookmarkInfo & { type: BOOKMARK_TYPES.FOLDER }
}>
