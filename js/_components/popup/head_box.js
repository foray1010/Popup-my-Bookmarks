import {element} from 'deku';

function closeHandler(event, {props, state}, updateState) {

}

function render({props, state}) {
  return (
    <div class='head-box'>
      <div class='head-title no-text-overflow'>{''}</div>
      <div class='head-close' onClick={closeHandler} />
    </div>
  );
}

export default {render};
