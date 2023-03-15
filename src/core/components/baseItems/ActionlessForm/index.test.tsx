import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type * as React from 'react'

import ActionlessForm from './index.js'

describe('ActionlessForm', () => {
  it('should prevent default form submit action', async () => {
    const user = userEvent.setup()
    const handleSubmit = jest.fn<
      void,
      [React.FormEvent<HTMLFormElement>],
      void
    >((evt) => {
      evt.persist()
    })
    const name = 'click me'

    render(
      <ActionlessForm onSubmit={handleSubmit}>
        <button type='submit'>{name}</button>
      </ActionlessForm>,
    )

    await user.click(screen.getByRole('button', { name }))

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultPrevented: true,
      }),
    )
  })
})
