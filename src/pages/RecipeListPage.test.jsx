import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import RecipeListPage from './RecipeListPage'
import { useRecipes } from '../hooks'

vi.mock('../hooks', () => ({
  useRecipes: vi.fn(),
}))

vi.mock('../components/recipes/CategoryFilter', () => ({
  __esModule: true,
  default: ({ onCategoryChange }) => (
    <button onClick={() => onCategoryChange(99)}>Mock Category</button>
  ),
}))

const mockUseRecipes = useRecipes

const renderPage = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <RecipeListPage />
      </MemoryRouter>
    </HelmetProvider>
  )

describe('RecipeListPage', () => {
  beforeEach(() => {
    mockUseRecipes.mockReset()
    window.scrollTo.mockClear()
  })

  it('shows filters, recipe list, and pagination controls', async () => {
    mockUseRecipes.mockReturnValue({
      data: {
        data: [
          { id: 10, name: 'Garden Salad', description: 'Fresh greens' },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 3,
          hasNext: true,
          hasPrevious: false,
        },
      },
      isLoading: false,
      error: null,
    })

    const user = userEvent.setup()
    renderPage()

    expect(screen.getByRole('heading', { name: /all recipes/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', expect.stringContaining('Search recipes'))
    expect(screen.getByText(/garden salad/i)).toBeInTheDocument()
    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument()

    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton).not.toBeDisabled()
    await user.click(nextButton)
    expect(window.scrollTo).toHaveBeenCalled()

    const prevButton = screen.getByRole('button', { name: /previous/i })
    expect(prevButton).toBeDisabled()
  })
})
