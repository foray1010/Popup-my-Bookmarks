import {h} from 'preact'

const msgNoResult = chrome.i18n.getMessage('noResult')

const NoResult = () => (
  <li>
    <p className='no-result no-text-overflow'>
      {msgNoResult}
    </p>
  </li>
)

export default NoResult
