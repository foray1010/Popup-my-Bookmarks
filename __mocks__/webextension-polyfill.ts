const webExtension: Record<string, unknown> = new Proxy(
  {},
  {
    get: () => webExtension,
  },
)

export default webExtension
