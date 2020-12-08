import { RoutePath } from '../constants'
import Contributors from './Contributors'
import { useNavigationContext } from './navigationContext'
import OptionForm from './OptionForm'

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
