import type * as CST from '../constants/index.js'

export interface BookmarkInfo {
  readonly iconUrl: string
  readonly id: string
  readonly isRoot: boolean
  readonly isSimulated: boolean
  readonly isUnmodifiable: boolean
  readonly parentId: string
  readonly storageIndex: number
  readonly title: string
  readonly type: CST.BOOKMARK_TYPES
  readonly url: string
}

export interface BookmarkTree {
  readonly children: ReadonlyArray<BookmarkInfo>
  readonly parent: BookmarkInfo
}

export interface LastPosition {
  readonly id: string
  readonly scrollTop: number
}
