import { RoutePath } from '../constants/index.js'
import Contributors from './Contributors.js'
import { useNavigationContext } from './navigationContext.js'
import OptionForm from './OptionForm/index.js'

export default function Router() {
  const { currentPath } = useNavigationContext()

  switch (currentPath) {
    case RoutePath.Contributors:
      return <Contributors />

    case RoutePath.Control:
    case RoutePath.General:
    case RoutePath.UserInterface:
      return <OptionForm />

    default:
      return null
  }
}
