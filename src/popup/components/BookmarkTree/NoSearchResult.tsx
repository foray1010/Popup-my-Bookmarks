import webExtension from 'webextension-polyfill'

import * as classes from './no-search-result.module.css'

export default function NoSearchResult() {
  return (
    <p className={classes.main}>{webExtension.i18n.getMessage('noResult')}</p>
  )
}
