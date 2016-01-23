const JSONStorage = {
  get: (key) => JSON.parse(window.localStorage.getItem(key)),
  set: (key, value) => window.localStorage.setItem(key, JSON.stringify(value))
}

export default JSONStorage
