import 'string.prototype.includes'
import 'string.prototype.repeat'
import 'string.prototype.startswith'

{
  // set or unset CSS
  window.CSS = (() => {
    const styleElem = document.createElement('style')
    document.head.appendChild(styleElem)

    const sheet = styleElem.sheet

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
    get: (name) => JSON.parse(localStorage.getItem(name)),
    set: (name, value) => localStorage.setItem(name, JSON.stringify(value))
  }

  function propEach(obj, fn) {
    const propArr = Object.getOwnPropertyNames(obj)

    let propName

    while (propName = propArr.shift()) {
      fn(propName, obj[propName])
    }
  }
}
