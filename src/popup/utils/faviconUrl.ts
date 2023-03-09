import webExtension from 'webextension-polyfill'

export function faviconUrl(pageUrl: string) {
  const url = new URL(webExtension.runtime.getURL('/_favicon/'))
  url.searchParams.set('pageUrl', pageUrl)
  return url.toString()
}
