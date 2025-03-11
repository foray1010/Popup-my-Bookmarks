import classNames from 'classix'
import type { ValueOf } from 'type-fest'
import webExtension from 'webextension-polyfill'

import Button from '../../../core/components/baseItems/Button/index.js'
import { RoutePath } from '../../constants/index.js'
import { useNavigationContext } from '../navigationContext.js'
import * as classes from './styles.module.css'

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
] as const satisfies ReadonlyArray<
  Readonly<{
    path: ValueOf<typeof RoutePath>
    title: string
  }>
>

export default function NavBar() {
  const { currentPath, setCurrentPath } = useNavigationContext()

  return (
    <nav className={classes.main}>
      {navBarItemInfos.map(({ path, title }) => (
        <Button
          key={path}
          className={classNames(
            classes.button,
            path === currentPath && classes.active,
          )}
          onClick={() => setCurrentPath(path)}
        >
          {title}
        </Button>
      ))}
    </nav>
  )
}
