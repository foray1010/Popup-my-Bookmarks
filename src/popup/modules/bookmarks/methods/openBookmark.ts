import webExtension from 'webextension-polyfill'

import { BOOKMARK_TYPES, OPEN_IN_TYPES, OPTIONS } from '../../../constants'
import { getOptions } from '../../options'
import { getBookmarkInfo, getBookmarkTree } from './getBookmark'

async function getUrls(ids: string[]): Promise<string[]> {
  const bookmarkInfos = await Promise.all(ids.map(getBookmarkInfo))

  const filteredBookmarkInfos = bookmarkInfos.filter(
    (bookmarkInfo) =>
      bookmarkInfo.isSimulated === false &&
      bookmarkInfo.type === BOOKMARK_TYPES.BOOKMARK,
  )
  return filteredBookmarkInfos.map((bookmarkInfo) => bookmarkInfo.url)
}

type OpenBookmarkProps = {
  openIn: OPEN_IN_TYPES
  isAllowBookmarklet: boolean
  isCloseThisExtension: boolean
}
export async function openBookmarksInBrowser(
  ids: string[],
  openBookmarkProps: OpenBookmarkProps,
) {
  const options = await getOptions()

  const allUrls = await getUrls(ids)
  if (!allUrls.length) return

  const isJSProtocol = (url: string) => url.startsWith('javascript:')

  const bookmarkletUrls = allUrls.filter(isJSProtocol)
  if (openBookmarkProps.isAllowBookmarklet && bookmarkletUrls.length > 0) {
    await webExtension.tabs.executeScript({
      code: bookmarkletUrls[0],
    })
  }

  const urls = allUrls.filter((x) => !isJSProtocol(x))
  if (urls.length > 0) {
    if (urls.length > 5) {
      const msgAskOpenAllTemplate = webExtension.i18n.getMessage('askOpenAll')
      const msgAskOpenAll = msgAskOpenAllTemplate.replace(
        '%bkmarkCount%',
        String(urls.length),
      )
      if (options[OPTIONS.WARN_OPEN_MANY] && !window.confirm(msgAskOpenAll))
        return
    }

    switch (openBookmarkProps.openIn) {
      case OPEN_IN_TYPES.BACKGROUND_TAB:
      case OPEN_IN_TYPES.NEW_TAB:
        for (const url of urls) {
          await webExtension.tabs.create({
            url,
            active: openBookmarkProps.openIn !== OPEN_IN_TYPES.BACKGROUND_TAB,
          })
        }
        break

      case OPEN_IN_TYPES.CURRENT_TAB:
        await webExtension.tabs.update({ url: urls[0] })
        break

      case OPEN_IN_TYPES.INCOGNITO_WINDOW:
      case OPEN_IN_TYPES.NEW_WINDOW:
        await webExtension.windows.create({
          url: urls,
          incognito:
            openBookmarkProps.openIn === OPEN_IN_TYPES.INCOGNITO_WINDOW,
        })
        break

      default:
    }
  }

  if (openBookmarkProps.isCloseThisExtension) window.close()
}

export async function openFolderInBrowser(
  id: string,
  openBookmarkProps: OpenBookmarkProps,
) {
  const bookmarkTree = await getBookmarkTree(id)

  const bookmarkIds = bookmarkTree.children.map((x) => x.id)

  await openBookmarksInBrowser(bookmarkIds, openBookmarkProps)
}
