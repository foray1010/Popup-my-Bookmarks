const webExtension = new Proxy(
  {},
  {
    get: () => webExtension
  }
)

export default webExtension
