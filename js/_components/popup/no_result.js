import {element} from 'deku'

function render() {
  return (
    <div class='no-result no-text-overflow'>
      {chrome.i18n.getMessage('noResult')}
    </div>
  )
}

export default {render}
