class JSONStorage {
  constructor(namespace, defaultValue = null) {
    if (!namespace) throw new Error()

    this.defaultValue = defaultValue
    this.namespace = namespace
  }

  get() {
    const unparsedValue = window.localStorage.getItem(this.namespace)

    // most likely unset
    if (typeof unparsedValue !== 'string') {
      return this.defaultValue
    }

    return JSON.parse(unparsedValue)
  }

  set(value) {
    window.localStorage.setItem(this.namespace, JSON.stringify(value))
  }
}

export default JSONStorage
