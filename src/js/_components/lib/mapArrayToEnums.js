import Immutable from 'seamless-immutable'

function mapArrayToEnums(array) {
  const enums = {}

  for (const arrayItem of array) {
    enums[arrayItem] = arrayItem
  }

  return Immutable(enums)
}

export default mapArrayToEnums
