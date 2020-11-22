import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Button from '../Button'

describe('Button', () => {
  it('should not fire form submit when clicked in form', () => {
    const handleSubmit = jest.fn<void, [React.FormEvent<HTMLFormElement>]>()

    render(
      <form onSubmit={handleSubmit}>
        <Button />
      </form>,
    )

    userEvent.click(screen.getByRole('button'))

    expect(handleSubmit).not.toBeCalled()
  })
})
