import classNames from 'classnames'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import Input from '../../../core/components/baseItems/Input'
import { ReactComponent as Cross } from '../../images/cross.svg'
import { ReactComponent as Search } from '../../images/search.svg'
import classes from './search-input.css'

interface Props extends React.ComponentProps<typeof Input> {
  onCancel: () => void
}
const SearchInput = React.forwardRef<HTMLInputElement, Props>(
  function InnerSearchInput({ onCancel, ...inputProps }: Props, ref) {
    return (
      <div className={classes.main}>
        <Search className={classes.icon} />
        <Input
          ref={ref}
          inputMode='search'
          placeholder={webExtension.i18n.getMessage('search')}
          {...inputProps}
          className={classNames(classes['search-input'], inputProps.className)}
        />
        {inputProps.value ? (
          <Cross className={classes.icon} onClick={onCancel} />
        ) : null}
      </div>
    )
  },
)

export default SearchInput
