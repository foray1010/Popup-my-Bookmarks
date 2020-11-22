import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ActionlessForm from '../ActionlessForm'

describe('ActionlessForm', () => {
  it('should prevent default form submit action', () => {
    const handleSubmit = jest.fn<void, [React.FormEvent<HTMLFormElement>]>(
      (evt) => {
        evt.persist()
      },
    )

    render(
      <ActionlessForm onSubmit={handleSubmit}>
        <button type='submit' />
      </ActionlessForm>,
    )

    userEvent.click(screen.getByRole('button'))

    expect(handleSubmit).toBeCalledWith(
      expect.objectContaining({
        defaultPrevented: true,
      }),
    )
  })
})
