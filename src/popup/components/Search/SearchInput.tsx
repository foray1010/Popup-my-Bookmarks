import classNames from 'classix'
import { type ComponentProps, type FC, useId } from 'react'
import webExtension from 'webextension-polyfill'

import Input from '@/core/components/baseItems/Input/index.js'
import StylelessButton from '@/core/components/baseItems/StylelessButton/index.js'
import { Component as Cross } from '@/popup/images/cross.svg?svgUse'
import { Component as Search } from '@/popup/images/search.svg?svgUse'

import * as classes from './search-input.module.css'

type Props = Readonly<
  ComponentProps<typeof Input> & {
    onCancel(): void
  }
>
const SearchInput: FC<Props> = ({ onCancel, ref, ...inputProps }) => {
  const inputId = useId()

  return (
    <div className={classes.main} role='search'>
      <Search aria-hidden className={classes['search-icon']} />
      <Input
        ref={ref}
        inputMode='search'
        placeholder={webExtension.i18n.getMessage('search')}
        {...inputProps}
        className={classNames(classes['search-input'], inputProps.className)}
        id={inputId}
      />
      {inputProps.value ? (
        <StylelessButton
          aria-controls={inputId}
          aria-label={webExtension.i18n.getMessage('cancel')}
          className={classes['cancel-button']}
          onClick={onCancel}
        >
          <Cross aria-hidden className={classes['cancel-icon']} />
        </StylelessButton>
      ) : null}
    </div>
  )
}

export default SearchInput
