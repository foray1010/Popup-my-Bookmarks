import {element} from 'deku';

const _getMsg = chrome.i18n.getMessage;

function clickConfirmHandler(event, {props, state}) {
  closeEditor();
}

function clickCancelHandler(event, {props, state}) {
  closeEditor();
}

function closeEditor() {
  globals.setRootState({
    hiddenEditor: true,
    hiddenMenuCover: true
  });
}

function render({props, state}) {
  return (
    <div id='editor' class='panel-width' hidden={props.isHidden}>
      <span id='edit-title'>{''}</span>
      <input type='text' value={''} />
      <input type='text' value={''} />
      <button onClick={clickConfirmHandler}>{_getMsg('confirm')}</button>
      <button onClick={clickCancelHandler}>{_getMsg('cancel')}</button>
    </div>
  );
}

export default {render};
