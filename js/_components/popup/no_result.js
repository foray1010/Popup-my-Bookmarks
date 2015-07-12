import {element} from 'deku'

function render({props, state}) {
  return (
    <div class='no-result no-text-overflow'>
      {chrome.i18n.getMessage('noResult')}
    </div>
  )
}

export default {render}
