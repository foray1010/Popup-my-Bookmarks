import ChromePromise from 'chrome-promise'

window.chromep = new ChromePromise()

// set or unset CSS
window.CSS = (() => {
  const styleEl = document.createElement('style')

  document.head.appendChild(styleEl)

  const sheet = styleEl.sheet

  const set = (param1, param2) => {
    const _action = (styleSelector, styleList) => {
      let styleValue = ''

      propEach(styleList, (propName, propValue) => {
        styleValue += `${propName}:${propValue};`
      })

      sheet.insertRule(
        styleSelector + '{' + styleValue + '}',
        sheet.cssRules.length
      )
    }

    if (param2 === undefined) {
      propEach(param1, _action)
    } else {
      _action(param1, param2)
    }
  }

  const unsetAll = () => {
    while (sheet.cssRules[0]) {
      sheet.deleteRule(0)
    }
  }

  return {set, unsetAll}
})()

window.JSONStorage = {
  get: (key) => JSON.parse(window.localStorage.getItem(key)),
  set: (key, value) => window.localStorage.setItem(key, JSON.stringify(value))
}

function propEach(obj, fn) {
  for (const propName of Object.keys(obj)) {
    fn(propName, obj[propName])
  }
}
