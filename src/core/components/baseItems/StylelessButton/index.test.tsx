import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { FormEvent } from 'react'

import StylelessButton from './index.js'

describe('StylelessButton', () => {
  it('should not fire form submit when clicked in form', async () => {
    const user = userEvent.setup()
    const handleSubmit = jest.fn<void, [FormEvent<HTMLFormElement>], void>()
    const name = 'click me'

    render(
      <form onSubmit={handleSubmit}>
        <StylelessButton>{name}</StylelessButton>
      </form>,
    )

    await user.click(screen.getByRole('button', { name }))

    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('should fire form submit when type="submit"', async () => {
    const user = userEvent.setup()
    const handleSubmit = jest.fn<void, [FormEvent<HTMLFormElement>], void>(
      (evt) => {
        evt.preventDefault()
      },
    )
    const name = 'click me'

    render(
      <form onSubmit={handleSubmit}>
        <StylelessButton type='submit'>{name}</StylelessButton>
      </form>,
    )

    await user.click(screen.getByRole('button', { name }))

    expect(handleSubmit).toHaveBeenCalled()
  })
})
