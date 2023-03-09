import webExtension from 'webextension-polyfill'

import {
  BOOKMARK_TYPES,
  OPEN_IN_TYPES,
  OPTIONS,
} from '../../../constants/index.js'
import { getOptions } from '../../options.js'
import { getBookmarkInfo, getBookmarkTree } from './getBookmark.js'

async function getUrls(ids: readonly string[]): Promise<string[]> {
  const bookmarkInfos = await Promise.all(ids.map(getBookmarkInfo))

  const filteredBookmarkInfos = bookmarkInfos.filter(
    (bookmarkInfo) =>
      bookmarkInfo.isSimulated === false &&
      bookmarkInfo.type === BOOKMARK_TYPES.BOOKMARK,
  )
  return filteredBookmarkInfos.map((bookmarkInfo) => bookmarkInfo.url)
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
    // @ts-expect-error `func` actually takes the arguments from `args`, so it is not `() => void`
    func: (code: string): void => {
      const el = document.createElement('script')
      el.textContent = code
      document.body.appendChild(el)
      el.remove()
    },
    args: [code],
    // @ts-expect-error works fine in Chrome
    world: 'MAIN',
  })
}

type OpenBookmarkProps = {
  readonly openIn: OPEN_IN_TYPES
  readonly isAllowBookmarklet: boolean
  readonly isCloseThisExtension: boolean
}
export async function openBookmarksInBrowser(
  ids: readonly string[],
  openBookmarkProps: OpenBookmarkProps,
) {
  const options = await getOptions()

  const allUrls = await getUrls(ids)
  if (!allUrls.length) return

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
