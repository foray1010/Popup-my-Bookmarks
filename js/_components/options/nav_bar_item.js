import element from 'virtual-element'

function updateCurrentModule(event, {props}) {
  const navBarItemInfo = props.navBarItemInfo

  if (navBarItemInfo.module !== props.currentModule) {
    globals.getCurrentModuleOptions(navBarItemInfo.module).then((options) => {
      console.log(options)
      globals.setRootState({
        currentModule: navBarItemInfo.module,
        options: Immutable(options)
      })
    })
  }
}

function render({props}) {
  const navBarItemClasses = ['nav-bar-item']
  const navBarItemInfo = props.navBarItemInfo

  if (navBarItemInfo.module === props.currentModule) {
    navBarItemClasses.push('nav-bar-item-active')
  }

  return (
    <div class={navBarItemClasses.join(' ')} onClick={updateCurrentModule}>
      {chrome.i18n.getMessage(navBarItemInfo.msg)}
    </div>
  )
}

export default {render}
