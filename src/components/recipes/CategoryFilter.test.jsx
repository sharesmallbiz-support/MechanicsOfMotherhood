import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CategoryFilter from './CategoryFilter'
import { useCategories } from '../../hooks'

vi.mock('../../hooks', () => ({
  useCategories: vi.fn(),
}))

const mockUseCategories = useCategories

describe('CategoryFilter', () => {
  beforeEach(() => {
    mockUseCategories.mockReset()
  })

  it('shows a spinner while categories load', () => {
    mockUseCategories.mockReturnValue({ data: null, isLoading: true })

    const { container } = render(
      <CategoryFilter selectedCategoryId={null} onCategoryChange={vi.fn()} />
    )

    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders the default and fetched category buttons', () => {
    mockUseCategories.mockReturnValue({
      data: {
        data: [
          { id: 1, name: 'Breakfast' },
          { id: 2, name: 'Dinner' },
        ],
      },
      isLoading: false,
    })

    render(
      <CategoryFilter selectedCategoryId={2} onCategoryChange={vi.fn()} />
    )

    expect(screen.getByRole('button', { name: /all recipes/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /breakfast/i })).toHaveClass('bg-gray-200')
    expect(screen.getByRole('button', { name: /dinner/i })).toHaveClass('bg-blue-600')
  })

  it('calls onCategoryChange with the clicked value', async () => {
    mockUseCategories.mockReturnValue({
      data: {
        data: [
          { id: 3, name: 'Snacks' },
        ],
      },
      isLoading: false,
    })

    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(
      <CategoryFilter selectedCategoryId={null} onCategoryChange={handleChange} />
    )

    await user.click(screen.getByRole('button', { name: /snacks/i }))
    expect(handleChange).toHaveBeenCalledWith(3)

    await user.click(screen.getByRole('button', { name: /all recipes/i }))
    expect(handleChange).toHaveBeenCalledWith(null)
  })
})
