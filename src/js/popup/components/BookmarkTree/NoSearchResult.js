// @flow strict @jsx createElement

import {createElement} from 'react'
import webExtension from 'webextension-polyfill'

import classes from '../../../../css/popup/no-search-result.css'

const NoSearchResult = () => (
  <p className={classes.main}>{webExtension.i18n.getMessage('noResult')}</p>
)

export default NoSearchResult
