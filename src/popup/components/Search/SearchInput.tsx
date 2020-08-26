import classNames from 'classnames'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import Input from '../../../core/components/baseItems/Input'
import cancelIcon from '../../images/cancel.svg'
import searchIcon from '../../images/search.svg'
import classes from './search-input.css'

interface Props extends React.ComponentProps<typeof Input> {
  onCancel: () => void
}
const SearchInput = React.forwardRef<HTMLInputElement, Props>(
  function InnerSearchInput({ onCancel, ...inputProps }: Props, ref) {
    return (
      <div className={classes.main}>
        <img alt='' className={classes['search-icon']} src={searchIcon} />
        <Input
          ref={ref}
          inputMode='search'
          placeholder={webExtension.i18n.getMessage('search')}
          {...inputProps}
          className={classNames(classes['search-input'], inputProps.className)}
        />
        {inputProps.value ? (
          <img
            alt=''
            className={classes['cancel-icon']}
            src={cancelIcon}
            onClick={onCancel}
          />
        ) : null}
      </div>
    )
  },
)

export default SearchInput
