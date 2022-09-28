import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type * as React from 'react'

import ActionlessForm from '.'

describe('ActionlessForm', () => {
  it('should prevent default form submit action', async () => {
    const handleSubmit = jest.fn<void, [React.FormEvent<HTMLFormElement>]>(
      (evt) => {
        evt.persist()
      },
    )
    const name = 'click me'

    render(
      <ActionlessForm onSubmit={handleSubmit}>
        <button type='submit'>{name}</button>
      </ActionlessForm>,
    )

    await userEvent.click(screen.getByRole('button', { name }))

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultPrevented: true,
      }),
    )
  })
})
