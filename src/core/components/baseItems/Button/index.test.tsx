import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type * as React from 'react'

import Button from './index.js'

describe('Button', () => {
  it('should not fire form submit when clicked in form', async () => {
    const user = userEvent.setup()
    const handleSubmit = jest.fn<
      void,
      [React.FormEvent<HTMLFormElement>],
      void
    >()
    const name = 'click me'

    render(
      <form onSubmit={handleSubmit}>
        <Button>{name}</Button>
      </form>,
    )

    await user.click(screen.getByRole('button', { name }))

    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('should fire form submit when type="submit"', async () => {
    const user = userEvent.setup()
    const handleSubmit = jest.fn<
      void,
      [React.FormEvent<HTMLFormElement>],
      void
    >((evt) => {
      evt.preventDefault()
    })
    const name = 'click me'

    render(
      <form onSubmit={handleSubmit}>
        <Button type='submit'>{name}</Button>
      </form>,
    )

    await user.click(screen.getByRole('button', { name }))

    expect(handleSubmit).toHaveBeenCalled()
  })
})
