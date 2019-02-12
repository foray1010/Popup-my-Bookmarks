// @flow strict

export default (value: string) => {
  return value.trimLeft().replace(/\s+/g, ' ')
}
