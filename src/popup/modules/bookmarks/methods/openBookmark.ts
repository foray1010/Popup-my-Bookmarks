import type { ValueOf } from 'type-fest'
import webExtension from 'webextension-polyfill'

import { OPTIONS } from '@/core/constants/index.js'
import { notNullish } from '@/core/utils/array.js'
import { OPEN_IN_TYPES } from '@/popup/constants/menu.js'

import { getOptions } from '../../options.js'
import { BOOKMARK_TYPES } from '../constants.js'
import { getBookmarkInfo, getBookmarkTreeInfo } from './getBookmark.js'

async function getUrls(ids: readonly string[]): Promise<readonly string[]> {
  const bookmarkInfos = await Promise.all(ids.map(getBookmarkInfo))

  const filteredBookmarkInfos = bookmarkInfos.filter(
    (bookmarkInfo) =>
      bookmarkInfo.isSimulated === false &&
      bookmarkInfo.type === BOOKMARK_TYPES.BOOKMARK,
  )
  return filteredBookmarkInfos
    .map((bookmarkInfo) => bookmarkInfo.url)
    .filter(notNullish)
}

// suggested by https://groups.google.com/a/chromium.org/g/chromium-extensions/c/Inq88qfVoIs/m/gOeI5x2tBgAJ
async function execInPage(code: string) {
  const [currentTab] = await webExtension.tabs.query({
    currentWindow: true,
    active: true,
  })
  if (currentTab?.id === undefined) return

  await webExtension.scripting.executeScript({
    target: { tabId: currentTab.id },
    func: (code: string): void => {
      const el = document.createElement('script')
      el.textContent = code
      document.body.append(el)
      el.remove()
    },
    args: [code],
    world: 'MAIN',
  })
}

type OpenBookmarkProps = Readonly<{
  openIn: ValueOf<typeof OPEN_IN_TYPES>
  isAllowBookmarklet: boolean
  isCloseThisExtension: boolean
}>
export async function openBookmarksInBrowser(
  ids: readonly string[],
  openBookmarkProps: OpenBookmarkProps,
) {
  const options = await getOptions()

  const allUrls = await getUrls(ids)

  const isJSProtocol = (url: string) => url.startsWith('javascript:')

  const bookmarkletUrls = allUrls.filter(isJSProtocol)
  if (openBookmarkProps.isAllowBookmarklet) {
    for (const bookmarkletUrl of bookmarkletUrls) {
      await execInPage(bookmarkletUrl)
    }
  }

  const urls = allUrls.filter((x) => !isJSProtocol(x))
  if (urls.length > 0) {
    if (urls.length > 5) {
      const msgAskOpenAllTemplate = webExtension.i18n.getMessage('askOpenAll')
      const msgAskOpenAll = msgAskOpenAllTemplate.replace(
        '%bkmarkCount%',
        String(urls.length),
      )
      if (options[OPTIONS.WARN_OPEN_MANY] && !globalThis.confirm(msgAskOpenAll))
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
    }
  }

  if (openBookmarkProps.isCloseThisExtension) window.close()
}

export async function openFolderInBrowser(
  id: string,
  openBookmarkProps: OpenBookmarkProps,
) {
  const bookmarkTree = await getBookmarkTreeInfo(id)

  const bookmarkIds = bookmarkTree.children.map((x) => x.id)

  await openBookmarksInBrowser(bookmarkIds, openBookmarkProps)
}
