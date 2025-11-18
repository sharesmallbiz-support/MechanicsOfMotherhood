import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PrintableRecipe from './PrintableRecipe'

describe('PrintableRecipe', () => {
  const recipe = {
    name: 'Fluffy Pancakes',
    description: 'Family favorite breakfast',
    servings: 4,
    authorNM: 'Chef Ada',
    ingredients: '- Flour\n- Eggs',
    instructions: 'Mix and cook.',
  }

  beforeEach(() => {
    window.print = vi.fn()
  })

  it('returns null when recipe data is missing', () => {
    const { container } = render(<PrintableRecipe recipe={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders recipe metadata and content', () => {
    render(<PrintableRecipe recipe={recipe} />)

    expect(screen.getByRole('heading', { name: /fluffy pancakes/i })).toBeInTheDocument()
    expect(screen.getByText(/family favorite breakfast/i)).toBeInTheDocument()
    expect(screen.getByText(/servings/i)).toBeInTheDocument()
    expect(screen.getAllByText(/mechanics of motherhood/i)).toHaveLength(2)
  })

  it('invokes window.print when the button is clicked', async () => {
    const user = userEvent.setup()
    render(<PrintableRecipe recipe={recipe} />)

    await user.click(screen.getByRole('button', { name: /print recipe/i }))

    expect(window.print).toHaveBeenCalledTimes(1)
  })
})
