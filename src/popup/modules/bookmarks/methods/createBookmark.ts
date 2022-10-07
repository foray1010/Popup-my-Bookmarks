import { nanoid } from 'nanoid'
import webExtension from 'webextension-polyfill'

import { SEPARATE_THIS_URL } from '../../../constants'
import { toBookmarkInfo } from '../utils/transformers'
import { getBookmarkInfo } from './getBookmark'

async function createBookmark(bookmark: webExtension.bookmarks.CreateDetails) {
  const bookmarkNode = await webExtension.bookmarks.create({
    ...bookmark,
    title: bookmark.title?.trim(),
    url: bookmark.url?.trim(),
  })
  return toBookmarkInfo(bookmarkNode)
}

export async function createBookmarkAfterId({
  createAfterId,
  ...rest
}: Omit<webExtension.bookmarks.CreateDetails, 'index' | 'parentId'> & {
  readonly createAfterId: string
}) {
  const bookmarkInfo = await getBookmarkInfo(createAfterId)

  return await createBookmark({
    ...rest,
    index: bookmarkInfo.storageIndex + 1,
    parentId: bookmarkInfo.parentId,
  })
}

export async function bookmarkCurrentPage(
  rest: Omit<webExtension.bookmarks.CreateDetails, 'title' | 'url'>,
) {
  const [currentTab] = await webExtension.tabs.query({
    currentWindow: true,
    active: true,
  })
  if (!currentTab) throw new Error('cannot get current tab')

  return await createBookmark({
    ...rest,
    title: currentTab.title,
    url: currentTab.url,
  })
}

export async function createSeparator(
  rest: Omit<webExtension.bookmarks.CreateDetails, 'title' | 'url'>,
) {
  return await createBookmark({
    ...rest,
    title: '- '.repeat(54),
    // avoid duplicated URL which may be cleaned up by third-party tools
    url: `${SEPARATE_THIS_URL}#${nanoid()}`,
  })
}
