import webExtension from 'webextension-polyfill'

import classes from './no-search-result.css'

const NoSearchResult = () => (
  <p className={classes.main}>{webExtension.i18n.getMessage('noResult')}</p>
)

export default NoSearchResult
