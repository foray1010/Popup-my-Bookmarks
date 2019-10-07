const webExtension: object = new Proxy(
  {},
  {
    get: () => webExtension
  }
)

export default webExtension
