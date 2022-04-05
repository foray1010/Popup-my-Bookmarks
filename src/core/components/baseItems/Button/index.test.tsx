import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Button from '.'

describe('Button', () => {
  it('should not fire form submit when clicked in form', async () => {
    const handleSubmit = jest.fn<void, [React.FormEvent<HTMLFormElement>]>()
    const name = 'click me'

    render(
      <form onSubmit={handleSubmit}>
        <Button>{name}</Button>
      </form>,
    )

    await userEvent.click(screen.getByRole('button', { name }))

    expect(handleSubmit).not.toBeCalled()
  })

  it('should fire form submit when type="submit"', async () => {
    const handleSubmit = jest.fn<void, [React.FormEvent<HTMLFormElement>]>(
      (evt) => {
        evt.preventDefault()
      },
    )
    const name = 'click me'

    render(
      <form onSubmit={handleSubmit}>
        <Button type='submit'>{name}</Button>
      </form>,
    )

    await userEvent.click(screen.getByRole('button', { name }))

    expect(handleSubmit).toBeCalled()
  })
})
