import classNames from 'clsx'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import Input from '../../../core/components/baseItems/Input/index.js'
import Cross from '../../images/cross.svg?svgr'
import Search from '../../images/search.svg?svgr'
import classes from './search-input.module.css'

interface Props extends React.ComponentProps<typeof Input> {
  onCancel(): void
}
const SearchInput = React.forwardRef<HTMLInputElement, Props>(
  function InnerSearchInput({ onCancel, ...inputProps }: Props, ref) {
    return (
      <div className={classes['main']}>
        <Search className={classes['icon']} />
        <Input
          ref={ref}
          inputMode='search'
          placeholder={webExtension.i18n.getMessage('search')}
          {...inputProps}
          className={classNames(classes['searchInput'], inputProps.className)}
        />
        {inputProps.value ? (
          <Cross className={classes['icon']} onClick={onCancel} />
        ) : null}
      </div>
    )
  },
)

export default SearchInput
