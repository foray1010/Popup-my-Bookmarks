import {element} from 'deku';

const _getMsg = chrome.i18n.getMessage;

function inputHandler(event, {props, state}) {
}

function render({props, state}) {
  return (
    <div id='search-box'>
      <img id='search-img' src='/img/search.png' alt='' />
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
