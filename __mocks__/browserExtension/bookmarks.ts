/* eslint-disable @typescript-eslint/require-await */

// as structuredClone is not supported in `jsdom`
import 'core-js/stable/structured-clone.js'

import { WebExtEventEmitter } from './utils/WebExtEventEmitter.js'

// @TODO: handle `dateGroupModified` updates
class Bookmarks implements Readonly<typeof browser.bookmarks> {
  readonly #rootId = '0' // Chrome's root node id
  readonly #defaultParentId = '2' // Chrome's `Other Bookmarks` node id
  readonly #initialRootTreeNodesMutable: browser.bookmarks.BookmarkTreeNode[] =
    [
      {
        id: this.#rootId,
        title: '',
        children: [
          {
            id: '1',
            parentId: this.#rootId,
            index: 0,
            title: 'Bookmarks Bar',
            children: [],
            dateAdded: Date.now(),
            dateGroupModified: Date.now(),
          },
          {
            id: this.#defaultParentId,
            parentId: this.#rootId,
            index: 1,
            title: 'Other Bookmarks',
            children: [],
            dateAdded: Date.now(),
            dateGroupModified: Date.now(),
          },
        ],
        dateAdded: Date.now(),
      },
    ]
  #rootTreeNodesMutable = structuredClone(this.#initialRootTreeNodesMutable)

  // non-standard methods for testing
  public _resetRootTreeNodes() {
    this.#rootTreeNodesMutable = structuredClone(
      this.#initialRootTreeNodesMutable,
    )
  }

  #queryBookmarkTreeNodes(
    trees: readonly browser.bookmarks.BookmarkTreeNode[],
    condition: (
      bookmarkTreeNode: Readonly<browser.bookmarks.BookmarkTreeNode>,
    ) => boolean,
  ): readonly browser.bookmarks.BookmarkTreeNode[] {
    return trees.reduce<browser.bookmarks.BookmarkTreeNode[]>((acc, tree) => {
      return acc
        .concat(condition(tree) ? [tree] : [])
        .concat(this.#queryBookmarkTreeNodes(tree.children ?? [], condition))
    }, [])
  }

  #getOne(id: string): browser.bookmarks.BookmarkTreeNode {
    const [bookmarkTreeNode] = this.#queryBookmarkTreeNodes(
      this.#rootTreeNodesMutable,
      (node) => node.id === id,
    )
    if (!bookmarkTreeNode) {
      throw new Error("Can't find bookmark for id.")
    }
    return bookmarkTreeNode
  }

  readonly #toBookmarkNode = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    children,
    ...node
  }: Readonly<browser.bookmarks.BookmarkTreeNode>): Readonly<
    Omit<browser.bookmarks.BookmarkTreeNode, 'children'>
  > => node

  #isRootFolder(
    bookmarkTreeNode: Readonly<browser.bookmarks.BookmarkTreeNode>,
  ): boolean {
    return (
      bookmarkTreeNode.id === this.#rootId ||
      bookmarkTreeNode.parentId === this.#rootId
    )
  }

  public async get(idOrIdList: string | readonly string[]) {
    const idList = [idOrIdList].flat()
    const result = this.#queryBookmarkTreeNodes(
      this.#rootTreeNodesMutable,
      (node) => idList.includes(node.id),
    )
    if (result.length !== idList.length) {
      throw new Error("Can't find bookmark for id.")
    }

    return result.map(this.#toBookmarkNode)
  }

  public async getChildren(id: string) {
    const childrenNodes = this.#getOne(id).children ?? []
    return childrenNodes.map(this.#toBookmarkNode)
  }

  public async getRecent(numberOfItems: number) {
    return this.#queryBookmarkTreeNodes(
      this.#rootTreeNodesMutable,
      // exclude folders
      (node) => node.url !== undefined,
    )
      .map(this.#toBookmarkNode)
      .sort((a, b) => (b.dateAdded ?? 0) - (a.dateAdded ?? 0))
      .slice(0, numberOfItems)
  }

  public async getTree() {
    return this.#rootTreeNodesMutable
  }

  public async getSubTree(id: string) {
    const subTreeNode = this.#getOne(id)
    return [subTreeNode]
  }

  public async search(
    query:
      | string
      | Readonly<{
          query?: string | undefined
          url?: string | undefined
          title?: string | undefined
        }>,
  ) {
    const queryObject = typeof query === 'string' ? { query } : query

    if (queryObject.query === '') return []

    // May not be the same as the real one because of not sure how Chrome sorts the results
    return this.#queryBookmarkTreeNodes(this.#rootTreeNodesMutable, (node) => {
      if (this.#isRootFolder(node)) return false

      if (queryObject.query !== undefined) {
        const isMatched =
          node.title.includes(queryObject.query) ||
          (node.url?.includes(queryObject.query) ?? false)
        if (!isMatched) return false
      }

      if (queryObject.title !== undefined) {
        if (node.title !== queryObject.title) return false
      }

      if (queryObject.url !== undefined) {
        // Chrome has some kind of URL normalization before comparing the string, but not sure the logic
        if (node.url !== queryObject.url) return false
      }

      return true
    }).map(this.#toBookmarkNode)
  }

  #modifyValidation(
    bookmarkTreeNode: Readonly<browser.bookmarks.BookmarkTreeNode>,
  ): void {
    if (this.#isRootFolder(bookmarkTreeNode)) {
      throw new Error("Can't modify the root bookmark folders.")
    }
  }

  #calculateNewIndex(
    parentIdOrOption:
      | string
      | Readonly<{ oldParentId: string | undefined; newParentId: string }>,
    index: number | undefined,
  ): number {
    const parentOption =
      typeof parentIdOrOption === 'string'
        ? { oldParentId: undefined, newParentId: parentIdOrOption }
        : parentIdOrOption

    const parentTreeNode = this.#getOne(parentOption.newParentId)
    const lastAvailableIndex =
      parentTreeNode.children!.length -
      (parentOption.oldParentId === parentOption.newParentId ? 1 : 0)

    if (index === undefined) {
      return lastAvailableIndex
    }

    if (index < 0) {
      throw new TypeError('index must be at least 0')
    }

    if (index > lastAvailableIndex) {
      throw new Error('Index out of bounds.')
    }

    return index
  }

  public async create(
    bookmark: Readonly<browser.bookmarks.CreateDetails>,
  ): Promise<browser.bookmarks.BookmarkTreeNode> {
    const numberId = crypto.getRandomValues(new Uint32Array(1))[0]
    if (numberId === undefined) throw new TypeError('Failed to generate id')

    const parentId = bookmark.parentId ?? this.#defaultParentId
    const bookmarkTreeNode = {
      id: numberId.toString(),
      parentId, // default parent id for Chrome
      index: this.#calculateNewIndex(parentId, bookmark.index),
      title: bookmark.title ?? '', // if no title is provided, Chrome will use an empty string
      // if url is empty string, it will be treated as undefined and create a folder
      ...(bookmark.url
        ? {
            url: bookmark.url,
          }
        : {
            dateGroupModified: Date.now(),
          }),
      dateAdded: Date.now(),
    } as const satisfies browser.bookmarks.BookmarkTreeNode
    this.#modifyValidation(bookmarkTreeNode)

    // In Edge, it will skip creation if a bookmark with same title already exists, but in Chrome, it will create a duplicated bookmark node with different id. We aims at following the Chrome behavior in this mock.

    const parentTreeNode = this.#getOne(bookmarkTreeNode.parentId)
    parentTreeNode.children ??= []
    parentTreeNode.children.splice(
      bookmarkTreeNode.index,
      0,
      Object.hasOwn(bookmarkTreeNode, 'url')
        ? bookmarkTreeNode
        : { ...bookmarkTreeNode, children: [] },
    )

    this.onCreated.dispatchEvent([bookmarkTreeNode.id, bookmarkTreeNode])

    return bookmarkTreeNode
  }

  public async move(
    id: string,
    destination: Readonly<browser.bookmarks._MoveDestination>,
  ) {
    const bookmarkTreeNode = this.#getOne(id)
    this.#modifyValidation(bookmarkTreeNode)

    const oldParentId = bookmarkTreeNode.parentId!
    const newParentId = destination.parentId ?? oldParentId

    const oldIndex = bookmarkTreeNode.index!
    const newIndex = this.#calculateNewIndex(
      {
        oldParentId,
        newParentId,
      },
      destination.index,
    )

    if (oldParentId !== newParentId || oldIndex !== newIndex) {
      const oldParentTreeNode = this.#getOne(oldParentId)
      oldParentTreeNode.children ??= []
      oldParentTreeNode.children.splice(oldIndex, 1)

      bookmarkTreeNode.parentId = newParentId
      bookmarkTreeNode.index = newIndex

      const newParentTreeNode = this.#getOne(newParentId)
      newParentTreeNode.children ??= []
      newParentTreeNode.children.splice(newIndex, 0, bookmarkTreeNode)

      // it will not fire event for the children of the moved node
      this.onMoved.dispatchEvent([
        id,
        {
          parentId: newParentId,
          oldParentId,
          index: newIndex,
          oldIndex,
        },
      ])
    }

    return this.#toBookmarkNode(bookmarkTreeNode)
  }

  public async update(
    id: string,
    changes: Readonly<browser.bookmarks._UpdateChanges>,
  ) {
    const bookmarkTreeNode = this.#getOne(id)
    this.#modifyValidation(bookmarkTreeNode)

    let isChanged = false

    if (
      changes.title !== undefined &&
      bookmarkTreeNode.title !== changes.title
    ) {
      bookmarkTreeNode.title = changes.title
      isChanged = true
    }

    if (
      changes.url !== undefined &&
      changes.url !== '' && // ignore empty string
      bookmarkTreeNode.url !== changes.url
    ) {
      if (bookmarkTreeNode.url === undefined) {
        throw new Error("Can't set URL of a bookmark folder.")
      }

      bookmarkTreeNode.url = changes.url
      isChanged = true
    }

    if (isChanged) {
      this.onChanged.dispatchEvent([
        id,
        {
          title: bookmarkTreeNode.title, // title always exists
          ...(changes.url !== undefined && { url: bookmarkTreeNode.url }),
        },
      ])
    }

    return this.#toBookmarkNode(bookmarkTreeNode)
  }

  public async remove(id: string) {
    const bookmarkTreeNode = this.#getOne(id)
    this.#modifyValidation(bookmarkTreeNode)

    if (bookmarkTreeNode.children && bookmarkTreeNode.children.length > 0) {
      // cannot remove non-empty folder
      throw new Error("Can't remove non-empty folder (use recursive to force).")
    }

    await this.removeTree(id)
  }

  public async removeTree(id: string) {
    const bookmarkTreeNode = this.#getOne(id)
    this.#modifyValidation(bookmarkTreeNode)

    // can remove bookmark (non-folder)
    const parentTreeNode = this.#getOne(bookmarkTreeNode.parentId!)
    parentTreeNode.children ??= []
    parentTreeNode.children = parentTreeNode.children.filter(
      (childNode) => childNode.id !== id,
    )

    // it does not fire event for the children of the removed node
    this.onRemoved.dispatchEvent([
      bookmarkTreeNode.id,
      {
        parentId: bookmarkTreeNode.parentId!,
        index: bookmarkTreeNode.index!,
        node: bookmarkTreeNode,
      },
    ])
  }

  public readonly onCreated = new WebExtEventEmitter<
    readonly [string, browser.bookmarks.BookmarkTreeNode]
  >()

  public readonly onRemoved = new WebExtEventEmitter<
    readonly [string, browser.bookmarks._OnRemovedRemoveInfo]
  >()

  public readonly onChanged = new WebExtEventEmitter<
    readonly [string, browser.bookmarks._OnChangedChangeInfo]
  >()

  public readonly onMoved = new WebExtEventEmitter<
    readonly [string, browser.bookmarks._OnMovedMoveInfo]
  >()

  // not supported in firefox, so skipping this mock
  public readonly onChildrenReordered: undefined
}

const bookmarks = new Bookmarks()
export default bookmarks
