import {element} from 'deku'

const msgNoResult = chrome.i18n.getMessage('noResult')

const NoResult = () => {
  return (
    <li>
      <p class='no-result no-text-overflow'>
        {msgNoResult}
      </p>
    </li>
  )
}

export default NoResult
