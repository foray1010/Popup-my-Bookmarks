import classNames from 'clsx'
import webExtension from 'webextension-polyfill'

import Button from '../../../core/components/baseItems/Button'
import { RoutePath } from '../../constants'
import { useNavigationContext } from '../navigationContext'
import classes from './styles.module.css'

const navBarItemInfos = [
  {
    path: RoutePath.General,
    title: webExtension.i18n.getMessage('general'),
  },
  {
    path: RoutePath.UserInterface,
    title: webExtension.i18n.getMessage('userInterface'),
  },
  {
    path: RoutePath.Control,
    title: webExtension.i18n.getMessage('control'),
  },
  {
    path: RoutePath.Contributors,
    title: webExtension.i18n.getMessage('contributors'),
  },
] as const

export default function NavBar() {
  const { currentPath, setCurrentPath } = useNavigationContext()

  return (
    <nav className={classes['main']}>
      {navBarItemInfos.map(({ path, title }) => (
        <Button
          key={path}
          className={classNames(classes['button'], {
            [classes['active'] ?? '']: path === currentPath,
          })}
          onClick={() => setCurrentPath(path)}
        >
          {title}
        </Button>
      ))}
    </nav>
  )
}
