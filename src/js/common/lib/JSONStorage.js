export const get = (key) => JSON.parse(window.localStorage.getItem(key))

export const set = (key, value) => window.localStorage.setItem(key, JSON.stringify(value))
