import {element} from 'deku';

function render({props, state}) {
  return (
    <div class='box-template'>
      <div class='headbox'>
        <div class='head-title no-text-overflow'>{''}</div>
        <div class='head-close' />
      </div>
      <div class='folderlist'>{''}</div>
    </div>
  );
}

export default {render};
