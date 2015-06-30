import {element} from 'deku';

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
  const msgCancel = chrome.i18n.getMessage('cancel');
  const msgConfirm = chrome.i18n.getMessage('confirm');

  const isHidden = !editTarget;

  let editorTitle;
  let isFolderItem;
  let itemTitle;
  let itemUrl;

  if (editTarget) {
    itemTitle = editTarget.title;
    itemUrl = editTarget.url;

    isFolderItem = globals.isFolder(editTarget);

    editorTitle = chrome.i18n.getMessage(isFolderItem ? 'rename' : 'edit');
  }

  return (
    <div id='editor' class='panel-width' hidden={isHidden}>
      <span id='editor-title'>{editorTitle}</span>
      <input type='text' value={itemTitle} />
      <input type='text' value={itemUrl} hidden={isFolderItem} />
      <button onClick={clickConfirmHandler}>{msgConfirm}</button>
      <button onClick={clickCancelHandler}>{msgCancel}</button>
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
