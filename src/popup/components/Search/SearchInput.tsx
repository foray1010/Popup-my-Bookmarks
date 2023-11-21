import classNames from 'classix'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import Input from '../../../core/components/baseItems/Input/index.js'
import Cross from '../../images/cross.svg?svgr'
import Search from '../../images/search.svg?svgr'
import classes from './search-input.module.css'

type Props = Readonly<
  React.ComponentProps<typeof Input> & {
    onCancel(): void
  }
>
const SearchInput = React.forwardRef<HTMLInputElement, Props>(
  function InnerSearchInput({ onCancel, ...inputProps }, ref) {
    const inputId = React.useId()

    return (
      <div className={classes.main} role='search'>
        <Search className={classes.icon} />
        <Input
          ref={ref}
          inputMode='search'
          placeholder={webExtension.i18n.getMessage('search')}
          {...inputProps}
          className={classNames(classes['search-input'], inputProps.className)}
          id={inputId}
        />
        {inputProps.value ? (
          <Cross
            aria-controls={inputId}
            aria-label={webExtension.i18n.getMessage('cancel')}
            className={classes.icon}
            role='button'
            onClick={onCancel}
          />
        ) : null}
      </div>
    )
  },
)

export default SearchInput
