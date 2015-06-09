import {element} from 'deku';

const _getMsg = chrome.i18n.getMessage;

function inputHandler(event, {props, state}) {
}

function render({props, state}) {
  return (
    <div id='searchbox'>
      <input
        id='search-input'
        type='search'
        placeholder={_getMsg('search')}
        tabindex='-1'
        onInput={inputHandler} />
    </div>
  );
}

export default {render};
