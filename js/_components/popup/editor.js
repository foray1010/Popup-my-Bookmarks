import {element} from 'deku';

const _getMsg = chrome.i18n.getMessage;

function afterRender({props}, el) {
  const editTarget = props.editTarget;

  const isHidden = !editTarget;

  if (!isHidden) {
    setEditorPos(el);
  }
}

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
  const editTarget = props.editTarget;

  const isHidden = !editTarget;

  let editorTitle;
  let isItemFolder;
  let itemTitle;
  let itemUrl;

  if (editTarget) {
    itemTitle = editTarget.title;
    itemUrl = editTarget.url;

    isItemFolder = !itemUrl;

    editorTitle = _getMsg(isItemFolder ? 'rename' : 'edit');
  }

  return (
    <div id='editor' class='panel-width' hidden={isHidden}>
      <span id='editor-title'>{editorTitle}</span>
      <input type='text' value={itemTitle} />
      <input type='text' value={itemUrl} hidden={isItemFolder} />
      <button onClick={clickConfirmHandler}>{_getMsg('confirm')}</button>
      <button onClick={clickCancelHandler}>{_getMsg('cancel')}</button>
    </div>
  );
}

function setEditorPos(el) {
  const body = document.body;
  const editorHeight = el.offsetHeight;
  const editorWidth = el.offsetWidth;

  const bodyHeight = body.scrollHeight;
  const bodyWidth = body.offsetWidth;

  const bottomPos = bodyHeight - editorHeight;
  const rightPos = bodyWidth - editorWidth;

  el.style.bottom = Math.max(bottomPos, 0) + 'px';
  el.style.right = Math.max(rightPos, 0) + 'px';
}

export default {afterRender, render};
