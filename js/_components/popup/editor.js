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
    editTarget: null
  });
}

function render({props, state}) {
  const itemInfo = props.editTarget;

  const isHidden = !itemInfo;

  let editorTitle;
  let isItemFolder;
  let itemTitle;
  let itemUrl;

  if (itemInfo) {
    itemTitle = itemInfo.title;
    itemUrl = itemInfo.url;

    isItemFolder = !itemUrl;

    editorTitle = _getMsg(isItemFolder ? 'rename' : 'edit');
  }

  return (
    <div id='editor' class='panel-width' hidden={isHidden}>
      <span id='edit-title'>{editorTitle}</span>
      <input type='text' value={itemTitle} />
      <input type='text' value={itemUrl} hidden={isItemFolder} />
      <button onClick={clickConfirmHandler}>{_getMsg('confirm')}</button>
      <button onClick={clickCancelHandler}>{_getMsg('cancel')}</button>
    </div>
  );
}

export default {render};
