import { setTimeout as sleep } from 'node:timers/promises'

import bookmarks from './bookmarks.js'

describe('browser.bookmarks', () => {
  beforeEach(() => {
    bookmarks._resetRootTreeNodes()
  })

  describe('bookmarks.get', () => {
    it('should be able to get single bookmark or folder', async () => {
      const bookmark = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })
      const bookmarkResult = await bookmarks.get(bookmark.id)
      expect(bookmarkResult).toStrictEqual([bookmark])

      const folder = await bookmarks.create({
        title: 'test2',
      })
      const folderResult = await bookmarks.get(folder.id)
      expect(folderResult).toStrictEqual([folder])
    })

    it('should be able to get multiple bookmarks and folders', async () => {
      const bookmark = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })

      const folder = await bookmarks.create({
        title: 'test2',
      })

      const result = await bookmarks.get([bookmark.id, folder.id])
      expect(result).toStrictEqual([bookmark, folder])
    })

    it('should throw error when one of the bookmark id does not exist', async () => {
      const bookmark = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })
      await expect(async () => {
        await bookmarks.get([bookmark.id, 'not-exist-id'])
      }).rejects.toThrow("Can't find bookmark for id.")
    })
  })

  describe('bookmarks.getChildren', () => {
    it('should be able to get children', async () => {
      const folder = await bookmarks.create({
        title: 'test',
      })

      const bookmark = await bookmarks.create({
        title: 'test2',
        url: 'https://duckduckgo.com',
        parentId: folder.id,
      })

      const result = await bookmarks.getChildren(folder.id)
      expect(result).toStrictEqual([bookmark])
    })

    it('should be able to get sub folder without children', async () => {
      const folder = await bookmarks.create({
        title: 'test',
      })

      const subFolder = await bookmarks.create({
        title: 'test2',
        parentId: folder.id,
      })

      await bookmarks.create({
        title: 'test3',
        url: 'https://duckduckgo.com',
        parentId: subFolder.id,
      })

      const [childNode] = await bookmarks.getChildren(folder.id)
      expect(childNode).toStrictEqual(subFolder)
      expect(childNode).not.toHaveProperty('children')
    })

    it('should throw error when folder id does not exist', async () => {
      await expect(async () => {
        await bookmarks.getChildren('not-exist-id')
      }).rejects.toThrow("Can't find bookmark for id.")
    })
  })

  describe('bookmarks.getRecent', () => {
    it('should not get any root folder', async () => {
      const result = await bookmarks.getRecent(1)
      // by default, all nodes are root folders
      expect(result).toHaveLength(0)
    })

    it('should not get any folder', async () => {
      await bookmarks.create({
        title: 'test',
      })

      const result = await bookmarks.getRecent(1)
      expect(result).toHaveLength(0)
    })

    it('should get bookmark', async () => {
      const bookmark = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })

      const result = await bookmarks.getRecent(1)
      expect(result).toStrictEqual([bookmark])
    })

    it('should be sorted by dateAdded descendingly', async () => {
      const bookmark1 = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })

      // make sure the dateAdded is not the same
      await sleep(10)

      const bookmark2 = await bookmarks.create({
        title: 'test2',
        url: 'https://google.com',
      })

      const result = await bookmarks.getRecent(10)
      expect(result).toStrictEqual([bookmark2, bookmark1])
    })

    it('should limit the number of result by parameter', async () => {
      await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })

      // make sure the dateAdded is not the same
      await sleep(10)

      const bookmark2 = await bookmarks.create({
        title: 'test2',
        url: 'https://google.com',
      })

      const result = await bookmarks.getRecent(1)
      expect(result).toStrictEqual([bookmark2])
    })
  })

  describe('bookmarks.getTree', () => {
    it('should be able to get whole tree', async () => {
      const trees = await bookmarks.getTree()
      expect(trees).toStrictEqual([
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        {
          id: '0',
          title: '',
          children: [
            {
              id: '1',
              parentId: '0',
              index: 0,
              title: 'Bookmarks Bar',
              children: [],
              dateAdded: expect.any(Number),
              dateGroupModified: expect.any(Number),
            },
            {
              id: '2',
              parentId: '0',
              index: 1,
              title: 'Other Bookmarks',
              children: [],
              dateAdded: expect.any(Number),
              dateGroupModified: expect.any(Number),
            },
          ],
          dateAdded: expect.any(Number),
        },
        /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      ])
    })
  })

  describe('bookmarks.getSubTree', () => {
    it('should be able to get sub folder with children', async () => {
      const folder = await bookmarks.create({
        title: 'test',
      })

      const subFolder = await bookmarks.create({
        title: 'test2',
        parentId: folder.id,
      })

      const bookmark = await bookmarks.create({
        title: 'test3',
        url: 'https://duckduckgo.com',
        parentId: subFolder.id,
      })

      const [childNode] = await bookmarks.getSubTree(folder.id)
      expect(childNode).toStrictEqual({
        ...folder,
        children: [{ ...subFolder, children: [bookmark] }],
      })
    })

    it('should throw error when folder id does not exist', async () => {
      await expect(async () => {
        await bookmarks.getSubTree('not-exist-id')
      }).rejects.toThrow("Can't find bookmark for id.")
    })
  })

  describe('bookmarks.search', () => {
    it('should partially match title or url by using `query`', async () => {
      const folder = await bookmarks.create({
        title: 'test1',
      })

      const bookmark1 = await bookmarks.create({
        title: 'test2',
        url: 'https://duckduckgo.com/',
      })

      const bookmark2 = await bookmarks.create({
        title: '',
        url: 'https://duckduckgo.com/test3',
      })

      await bookmarks.create({
        title: '4',
        url: 'https://duckduckgo.com/4',
      })

      const result = await bookmarks.search('test')
      expect(result).toStrictEqual([folder, bookmark1, bookmark2])

      // should be the same as using string
      const resultFromQueryOption = await bookmarks.search({ query: 'test' })
      expect(result).toStrictEqual(resultFromQueryOption)
    })

    it('should return empty array when `query` === ""', async () => {
      await bookmarks.create({
        title: 'test1',
      })

      await bookmarks.create({
        title: 'test2',
        url: 'https://duckduckgo.com/',
      })

      await bookmarks.create({
        title: '',
        url: 'https://duckduckgo.com/test3',
      })

      const result = await bookmarks.search('')
      expect(result).toStrictEqual([])
    })

    it('should exact match the title by using `title`', async () => {
      const folder = await bookmarks.create({
        title: 'test',
      })

      await bookmarks.create({
        title: 'test2',
        url: 'https://duckduckgo.com/',
      })

      const bookmark2 = await bookmarks.create({
        title: '',
        url: 'https://duckduckgo.com/test3',
      })

      const result1 = await bookmarks.search({ title: 'test' })
      expect(result1).toStrictEqual([folder])

      const result2 = await bookmarks.search({ title: '' })
      expect(result2).toStrictEqual([bookmark2])
    })

    it('should exact match the url by using `url`', async () => {
      const bookmark1 = await bookmarks.create({
        title: 'test1',
        url: 'https://duckduckgo.com/',
      })

      const bookmark2 = await bookmarks.create({
        title: 'test2',
        url: 'https://duckduckgo.com/test2',
      })

      const result1 = await bookmarks.search({ url: 'https://duckduckgo.com/' })
      expect(result1).toStrictEqual([bookmark1])

      const result2 = await bookmarks.search({
        url: 'https://duckduckgo.com/test2',
      })
      expect(result2).toStrictEqual([bookmark2])
    })

    it('should match all `query`, `title` and `url`', async () => {
      const bookmark1 = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com/',
      })

      await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com/test2',
      })

      await bookmarks.create({
        title: 'test3',
        url: 'https://duckduckgo.com/',
      })

      await bookmarks.create({
        title: 'test',
      })

      const result1 = await bookmarks.search({
        query: 't',
        title: 'test',
        url: 'https://duckduckgo.com/',
      })
      expect(result1).toStrictEqual([bookmark1])
    })
  })

  describe('bookmarks.create', () => {
    it('should create bookmark', async () => {
      const bookmark = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })

      expect(bookmark).toStrictEqual({
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        id: expect.any(String),
        index: 0,
        parentId: '2',
        title: 'test',
        url: 'https://duckduckgo.com',
        dateAdded: expect.any(Number),
        /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      })

      expect(bookmark).toStrictEqual((await bookmarks.get(bookmark.id))[0])
    })

    it('should create bookmark without title', async () => {
      const bookmark = await bookmarks.create({})

      expect(bookmark.title).toBe('')
    })

    it('should create folder when url is not supplied', async () => {
      const folder = await bookmarks.create({
        title: 'test',
      })

      expect(folder).toStrictEqual({
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        id: expect.any(String),
        index: 0,
        parentId: '2',
        title: 'test',
        dateAdded: expect.any(Number),
        dateGroupModified: expect.any(Number),
        /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      })

      expect({ ...folder, children: [] }).toStrictEqual(
        (await bookmarks.getSubTree(folder.id))[0],
      )
    })

    it('should create folder when url is empty string', async () => {
      const folder = await bookmarks.create({
        url: '',
      })

      expect(folder.url).toBeUndefined()
    })

    it('should create bookmark in last index of the targeted parent', async () => {
      await bookmarks.create({
        title: 'test',
      })
      const lastBookmark = await bookmarks.create({
        title: 'test2',
      })

      expect(lastBookmark.index).toBe(1)
    })

    it('should throw error when index out of bound', async () => {
      await expect(async () => {
        await bookmarks.create({
          index: Number.MAX_SAFE_INTEGER,
        })
      }).rejects.toThrow('Index out of bounds.')

      // not an official error, but useful when writing tests
      await expect(async () => {
        await bookmarks.create({
          index: -1,
        })
      }).rejects.toThrow('index must be at least 0')
    })

    it('should fire onCreated callbacks', async () => {
      const testCallback1 = jest.fn()
      bookmarks.onCreated.addListener(testCallback1)
      expect(bookmarks.onCreated.hasListener(testCallback1)).toBe(true)

      // should fire on multiple listeners
      const testCallback2 = jest.fn()
      bookmarks.onCreated.addListener(testCallback2)
      expect(bookmarks.onCreated.hasListener(testCallback2)).toBe(true)

      // should not fire on removed listener
      const testCallback3 = jest.fn()
      bookmarks.onCreated.addListener(testCallback3)
      expect(bookmarks.onCreated.hasListener(testCallback3)).toBe(true)
      bookmarks.onCreated.removeListener(testCallback3)
      expect(bookmarks.onCreated.hasListener(testCallback3)).toBe(false)

      await bookmarks.create({
        title: 'test',
      })

      const args = [
        expect.any(String),
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        {
          id: expect.any(String),
          index: 0,
          parentId: '2',
          title: 'test',
          dateAdded: expect.any(Number),
          dateGroupModified: expect.any(Number),
        },
        /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      ] as const
      expect(testCallback1).toHaveBeenLastCalledWith(...args)
      expect(testCallback2).toHaveBeenLastCalledWith(...args)
      expect(testCallback3).not.toHaveBeenLastCalledWith(...args)
    })
  })

  describe('bookmarks.move', () => {
    it('should be able to move from one parent to another parent', async () => {
      const bookmark = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
        parentId: '2',
      })

      const respondedBookmark = await bookmarks.move(bookmark.id, {
        parentId: '1',
      })
      expect(respondedBookmark.parentId).toBe('1')

      const actualBookmark = (await bookmarks.get(bookmark.id))[0]
      expect(actualBookmark?.parentId).toBe('1')
    })

    it('should be able to move from one index to another index', async () => {
      const bookmark1 = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })
      expect(bookmark1.index).toBe(0)

      const bookmark2 = await bookmarks.create({
        title: 'test2',
        url: 'https://duckduckgo.com',
      })
      expect(bookmark2.index).toBe(1)

      const bookmark3 = await bookmarks.create({
        title: 'test3',
        url: 'https://bing.com',
      })
      expect(bookmark3.index).toBe(2)

      const respondedBookmark = await bookmarks.move(bookmark1.id, {
        index: 1,
      })
      expect(respondedBookmark.index).toBe(1)

      const actualBookmark = (await bookmarks.get(bookmark1.id))[0]
      expect(actualBookmark?.index).toBe(1)
    })

    it('should be able to move to the last+1 index of other parent', async () => {
      const bookmark1 = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
        parentId: '1',
      })
      expect(bookmark1.index).toBe(0)

      const bookmark2 = await bookmarks.create({
        title: 'test2',
        url: 'https://duckduckgo.com',
        parentId: '2',
      })
      expect(bookmark2.index).toBe(0)

      const respondedBookmark = await bookmarks.move(bookmark1.id, {
        parentId: '2',
        index: 1,
      })
      expect(respondedBookmark.index).toBe(1)

      const actualBookmark = (await bookmarks.get(bookmark1.id))[0]
      expect(actualBookmark?.index).toBe(1)
    })

    it('should be able to move to the last index of current parent if no parentId and index are provided', async () => {
      const bookmark1 = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })
      expect(bookmark1.index).toBe(0)

      const bookmark2 = await bookmarks.create({
        title: 'test2',
        url: 'https://duckduckgo.com',
      })
      expect(bookmark2.index).toBe(1)

      const bookmark3 = await bookmarks.create({
        title: 'test3',
        url: 'https://bing.com',
      })
      expect(bookmark3.index).toBe(2)

      const respondedBookmark = await bookmarks.move(bookmark1.id, {})
      expect(respondedBookmark.index).toBe(2)

      const actualBookmark = (await bookmarks.get(bookmark1.id))[0]
      expect(actualBookmark?.index).toBe(2)
    })

    it('should fire onMoved callbacks', async () => {
      const bookmark1 = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })

      await bookmarks.create({
        title: 'test2',
        url: 'https://duckduckgo.com',
      })

      const testCallback1 = jest.fn()
      bookmarks.onMoved.addListener(testCallback1)
      expect(bookmarks.onMoved.hasListener(testCallback1)).toBe(true)

      // should fire on multiple listeners
      const testCallback2 = jest.fn()
      bookmarks.onMoved.addListener(testCallback2)
      expect(bookmarks.onMoved.hasListener(testCallback2)).toBe(true)

      // should not fire on removed listener
      const testCallback3 = jest.fn()
      bookmarks.onMoved.addListener(testCallback3)
      expect(bookmarks.onMoved.hasListener(testCallback3)).toBe(true)
      bookmarks.onMoved.removeListener(testCallback3)
      expect(bookmarks.onMoved.hasListener(testCallback3)).toBe(false)

      await bookmarks.move(bookmark1.id, {})

      const args = [
        expect.any(String),
        {
          parentId: '2',
          oldParentId: '2',
          index: 1,
          oldIndex: 0,
        },
      ] as const
      expect(testCallback1).toHaveBeenLastCalledWith(...args)
      expect(testCallback2).toHaveBeenLastCalledWith(...args)
      expect(testCallback3).not.toHaveBeenLastCalledWith(...args)
    })

    it('should not fire onMoved callbacks if nothing is changed', async () => {
      const bookmark1 = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })

      await bookmarks.create({
        title: 'test2',
        url: 'https://duckduckgo.com',
      })

      const testCallback = jest.fn()
      bookmarks.onMoved.addListener(testCallback)

      await bookmarks.move(bookmark1.id, {
        parentId: bookmark1.parentId,
        index: bookmark1.index,
      })

      expect(testCallback).not.toHaveBeenCalled()
    })
  })

  describe('bookmarks.update', () => {
    it('should be able to update a bookmark', async () => {
      const bookmark = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })
      expect(bookmark.url).toBe('https://duckduckgo.com')

      const respondedBookmark = await bookmarks.update(bookmark.id, {
        title: 'test2',
        url: 'https://google.com',
      })
      expect(respondedBookmark).toMatchObject({
        title: 'test2',
        url: 'https://google.com',
      })

      const actualBookmark = (await bookmarks.get(bookmark.id))[0]
      expect(actualBookmark).toMatchObject({
        title: 'test2',
        url: 'https://google.com',
      })
    })

    it('should ignore empty url', async () => {
      const bookmark = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })
      expect(bookmark.url).toBe('https://duckduckgo.com')

      const respondedBookmark = await bookmarks.update(bookmark.id, {
        url: '',
      })
      expect(respondedBookmark.url).toBe('https://duckduckgo.com')

      const actualBookmark = (await bookmarks.get(bookmark.id))[0]
      expect(actualBookmark?.url).toBe('https://duckduckgo.com')
    })

    it('should not allow to set url to a folder', async () => {
      const folder = await bookmarks.create({
        title: 'test',
      })

      await expect(async () => {
        await bookmarks.update(folder.id, {
          url: 'https://duckduckgo.com',
        })
      }).rejects.toThrow("Can't set URL of a bookmark folder.")
    })

    it.each(['0', '1'])(
      'should not allow to update root folder (id=%s)',
      async (rootId) => {
        await expect(async () => {
          await bookmarks.update(rootId, {
            title: 'new_name',
          })
        }).rejects.toThrow("Can't modify the root bookmark folders.")
      },
    )

    it('should fire onMoved callbacks', async () => {
      const bookmark = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })

      const testCallback1 = jest.fn()
      bookmarks.onChanged.addListener(testCallback1)
      expect(bookmarks.onChanged.hasListener(testCallback1)).toBe(true)

      // should fire on multiple listeners
      const testCallback2 = jest.fn()
      bookmarks.onChanged.addListener(testCallback2)
      expect(bookmarks.onChanged.hasListener(testCallback2)).toBe(true)

      // should not fire on removed listener
      const testCallback3 = jest.fn()
      bookmarks.onChanged.addListener(testCallback3)
      expect(bookmarks.onChanged.hasListener(testCallback3)).toBe(true)
      bookmarks.onChanged.removeListener(testCallback3)
      expect(bookmarks.onChanged.hasListener(testCallback3)).toBe(false)

      await bookmarks.update(bookmark.id, {
        url: 'https://google.com',
      })

      const args = [
        expect.any(String),
        {
          title: 'test',
          url: 'https://google.com',
        },
      ] as const
      expect(testCallback1).toHaveBeenLastCalledWith(...args)
      expect(testCallback2).toHaveBeenLastCalledWith(...args)
      expect(testCallback3).not.toHaveBeenLastCalledWith(...args)
    })

    it('should not fire onMoved callbacks if nothing is changed', async () => {
      const bookmark = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })

      const testCallback = jest.fn()
      bookmarks.onMoved.addListener(testCallback)

      await bookmarks.update(bookmark.id, {
        url: 'https://duckduckgo.com',
      })

      expect(testCallback).not.toHaveBeenCalled()
    })
  })

  describe('bookmarks.remove', () => {
    it('should be able to remove a bookmark', async () => {
      const bookmark = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })

      await bookmarks.remove(bookmark.id)

      await expect(async () => {
        await bookmarks.get(bookmark.id)
      }).rejects.toThrow("Can't find bookmark for id.")
    })

    it('should be able to remove an empty folder', async () => {
      const folder = await bookmarks.create({
        title: 'test',
      })

      await bookmarks.remove(folder.id)

      await expect(async () => {
        await bookmarks.get(folder.id)
      }).rejects.toThrow("Can't find bookmark for id.")
    })

    it('should not allow to remove a non-empty folder', async () => {
      const folder = await bookmarks.create({
        title: 'test',
      })

      await bookmarks.create({
        title: 'test2',
        parentId: folder.id,
      })

      await expect(async () => {
        await bookmarks.remove(folder.id)
      }).rejects.toThrow(
        "Can't remove non-empty folder (use recursive to force).",
      )
    })

    it('should fire onRemoved callbacks', async () => {
      const bookmark = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })

      const testCallback1 = jest.fn()
      bookmarks.onRemoved.addListener(testCallback1)
      expect(bookmarks.onRemoved.hasListener(testCallback1)).toBe(true)

      // should fire on multiple listeners
      const testCallback2 = jest.fn()
      bookmarks.onRemoved.addListener(testCallback2)
      expect(bookmarks.onRemoved.hasListener(testCallback2)).toBe(true)

      // should not fire on removed listener
      const testCallback3 = jest.fn()
      bookmarks.onRemoved.addListener(testCallback3)
      expect(bookmarks.onRemoved.hasListener(testCallback3)).toBe(true)
      bookmarks.onRemoved.removeListener(testCallback3)
      expect(bookmarks.onRemoved.hasListener(testCallback3)).toBe(false)

      await bookmarks.remove(bookmark.id)

      const args = [
        expect.any(String),
        {
          parentId: bookmark.parentId,
          index: bookmark.index,
          node: bookmark,
        },
      ] as const
      expect(testCallback1).toHaveBeenLastCalledWith(...args)
      expect(testCallback2).toHaveBeenLastCalledWith(...args)
      expect(testCallback3).not.toHaveBeenLastCalledWith(...args)
    })
  })

  describe('bookmarks.removeTree', () => {
    it('should be able to remove a bookmark', async () => {
      const bookmark = await bookmarks.create({
        title: 'test',
        url: 'https://duckduckgo.com',
      })

      await bookmarks.removeTree(bookmark.id)

      await expect(async () => {
        await bookmarks.get(bookmark.id)
      }).rejects.toThrow("Can't find bookmark for id.")
    })

    it('should be able to remove an empty folder', async () => {
      const folder = await bookmarks.create({
        title: 'test',
      })

      await bookmarks.removeTree(folder.id)

      await expect(async () => {
        await bookmarks.get(folder.id)
      }).rejects.toThrow("Can't find bookmark for id.")
    })

    it('should be able to remove a non-empty folder', async () => {
      const folder = await bookmarks.create({
        title: 'test',
      })

      await bookmarks.create({
        title: 'test2',
        parentId: folder.id,
      })

      await bookmarks.removeTree(folder.id)

      await expect(async () => {
        await bookmarks.get(folder.id)
      }).rejects.toThrow("Can't find bookmark for id.")
    })

    it('should fire onRemoved callbacks', async () => {
      const folder = await bookmarks.create({
        title: 'test',
      })

      const childBookmark = await bookmarks.create({
        title: 'test2',
        url: 'https://duckduckgo.com',
        parentId: folder.id,
      })

      const testCallback1 = jest.fn()
      bookmarks.onRemoved.addListener(testCallback1)
      expect(bookmarks.onRemoved.hasListener(testCallback1)).toBe(true)

      // should fire on multiple listeners
      const testCallback2 = jest.fn()
      bookmarks.onRemoved.addListener(testCallback2)
      expect(bookmarks.onRemoved.hasListener(testCallback2)).toBe(true)

      // should not fire on removed listener
      const testCallback3 = jest.fn()
      bookmarks.onRemoved.addListener(testCallback3)
      expect(bookmarks.onRemoved.hasListener(testCallback3)).toBe(true)
      bookmarks.onRemoved.removeListener(testCallback3)
      expect(bookmarks.onRemoved.hasListener(testCallback3)).toBe(false)

      await bookmarks.removeTree(folder.id)

      const args = [
        expect.any(String),
        {
          parentId: folder.parentId,
          index: folder.index,
          node: { ...folder, children: [childBookmark] },
        },
      ] as const
      expect(testCallback1).toHaveBeenLastCalledWith(...args)
      expect(testCallback2).toHaveBeenLastCalledWith(...args)
      expect(testCallback3).not.toHaveBeenLastCalledWith(...args)
    })
  })
})
