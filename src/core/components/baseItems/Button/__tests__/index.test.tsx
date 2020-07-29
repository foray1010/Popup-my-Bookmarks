import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import Button from '../index'

describe('Button', () => {
  it('should not fire form submit when clicked in form', () => {
    const handleSubmit = jest.fn()

    render(
      <form onSubmit={handleSubmit}>
        <Button data-testid='button' />
      </form>,
    )

    userEvent.click(screen.getByTestId('button'))

    expect(handleSubmit).not.toBeCalled()
  })
})
