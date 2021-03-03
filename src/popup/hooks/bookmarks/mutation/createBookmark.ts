import { nanoid } from 'nanoid'
import { useMutation } from 'react-query'
import webExtension from 'webextension-polyfill'

import { queryClient } from '../../../../core/utils/queryClient'
import { SEPARATE_THIS_URL } from '../../../constants'
import type { BookmarkInfo } from '../../../types'
import { queryKey } from '../constants'
import { getBookmarkInfo } from '../query/useGetBookmarkInfo'
import { toBookmarkInfo } from '../utils/transformers'

async function createBookmark(bookmark: webExtension.bookmarks.CreateDetails) {
  const bookmarkNode = await webExtension.bookmarks.create({
    ...bookmark,
    title: bookmark.title?.trim(),
    url: bookmark.url?.trim(),
  })
  return toBookmarkInfo(bookmarkNode)
}

async function commonOnSuccess({ id, parentId }: BookmarkInfo) {
  await queryClient.invalidateQueries([queryKey, id])
  await queryClient.invalidateQueries([queryKey, parentId])
}

export function useCreateBookmarkAfterId() {
  return useMutation(
    async ({
      createAfterId,
      ...rest
    }: Omit<webExtension.bookmarks.CreateDetails, 'index' | 'parentId'> & {
      createAfterId: string
    }) => {
      const bookmarkInfo = await getBookmarkInfo(createAfterId)

      return await createBookmark({
        ...rest,
        index: bookmarkInfo.storageIndex + 1,
        parentId: bookmarkInfo.parentId,
      })
    },
    {
      onSuccess: commonOnSuccess,
    },
  )
}

export function useBookmarkCurrentPage() {
  return useMutation(
    async (
      rest: Omit<webExtension.bookmarks.CreateDetails, 'title' | 'url'>,
    ) => {
      const [currentTab] = await webExtension.tabs.query({
        currentWindow: true,
        active: true,
      })

      return await createBookmark({
        ...rest,
        title: currentTab.title,
        url: currentTab.url,
      })
    },
    {
      onSuccess: commonOnSuccess,
    },
  )
}

export function useCreateSeparator() {
  return useMutation(
    async (
      rest: Omit<webExtension.bookmarks.CreateDetails, 'title' | 'url'>,
    ) => {
      return await createBookmark({
        ...rest,
        title: '- '.repeat(54),
        // avoid duplicated URL which may be cleaned up by third-party tools
        url: `${SEPARATE_THIS_URL}#${nanoid()}`,
      })
    },
    {
      onSuccess: commonOnSuccess,
    },
  )
}
