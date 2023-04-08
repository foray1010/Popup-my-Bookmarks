import type { BOOKMARK_TYPES } from '../constants/index.js'

export type BookmarkInfo = {
  readonly id: string
  readonly isRoot: boolean
  readonly isSimulated: boolean
  readonly isUnmodifiable: boolean
  readonly parentId?: string | undefined
  readonly storageIndex: number
  readonly title: string
} & (
  | {
      readonly type: BOOKMARK_TYPES.BOOKMARK
      readonly iconUrl: string
      readonly url: string
    }
  | {
      readonly type: BOOKMARK_TYPES.DRAG_INDICATOR
      readonly iconUrl?: never
      readonly url?: never
    }
  | {
      readonly type: BOOKMARK_TYPES.FOLDER
      readonly iconUrl: string
      readonly url?: never
    }
  | {
      readonly type: BOOKMARK_TYPES.NO_BOOKMARK
      readonly iconUrl?: never
      readonly url?: never
    }
  | {
      readonly type: BOOKMARK_TYPES.SEPARATOR
      readonly iconUrl?: never
      readonly url: string
    }
)

export type BookmarkTreeInfo = {
  readonly children: ReadonlyArray<BookmarkInfo>
  readonly parent: BookmarkInfo & { readonly type: BOOKMARK_TYPES.FOLDER }
}

export type LastPosition = {
  readonly id: string
  readonly scrollTop: number
}
