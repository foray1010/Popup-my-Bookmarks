/* @flow */

class JSONStorage {
  defaultValue: any
  namespace: string

  constructor(namespace: string, defaultValue: any = null): void {
    this.defaultValue = defaultValue
    this.namespace = namespace
  }

  get(): Object {
    const unparsedValue: ?string = window.localStorage.getItem(this.namespace)

    if (!unparsedValue) {
      return this.defaultValue
    }

    return JSON.parse(unparsedValue)
  }

  set(value: any): void {
    window.localStorage.setItem(this.namespace, JSON.stringify(value))
  }
}

export default JSONStorage
