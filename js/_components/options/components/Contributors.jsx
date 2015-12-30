import element from 'virtual-element'

function render() {
  return (
    <div />
  )
}

function shouldUpdate() {
  // static HTML, never update
  return false
}

export default {render, shouldUpdate}
