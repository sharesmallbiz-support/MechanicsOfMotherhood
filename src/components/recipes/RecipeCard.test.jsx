import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import RecipeCard from './RecipeCard'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockRecipe = {
  id: 1,
  slug: 'chocolate-chip-cookies',
  name: 'Chocolate Chip Cookies',
  description: 'Delicious homemade cookies',
  servings: 24,
  authorNM: 'Jane Doe',
}

describe('RecipeCard Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  describe('rendering', () => {
    it('renders recipe name', () => {
      renderWithRouter(<RecipeCard recipe={mockRecipe} />)
      expect(screen.getByText('Chocolate Chip Cookies')).toBeInTheDocument()
    })

    it('renders recipe description', () => {
      renderWithRouter(<RecipeCard recipe={mockRecipe} />)
      expect(screen.getByText('Delicious homemade cookies')).toBeInTheDocument()
    })

    it('renders servings information', () => {
      renderWithRouter(<RecipeCard recipe={mockRecipe} />)
      expect(screen.getByText('24 servings')).toBeInTheDocument()
    })

    it('renders author name', () => {
      renderWithRouter(<RecipeCard recipe={mockRecipe} />)
      expect(screen.getByText(/By Jane Doe/)).toBeInTheDocument()
    })

    it('renders without description', () => {
      const recipeWithoutDesc = { ...mockRecipe, description: null }
      renderWithRouter(<RecipeCard recipe={recipeWithoutDesc} />)
      expect(screen.getByText('Chocolate Chip Cookies')).toBeInTheDocument()
    })

    it('renders without servings', () => {
      const recipeWithoutServings = { ...mockRecipe, servings: null }
      renderWithRouter(<RecipeCard recipe={recipeWithoutServings} />)
      expect(screen.queryByText(/servings/)).not.toBeInTheDocument()
    })

    it('renders without author', () => {
      const recipeWithoutAuthor = { ...mockRecipe, authorNM: null }
      renderWithRouter(<RecipeCard recipe={recipeWithoutAuthor} />)
      expect(screen.queryByText(/By/)).not.toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('navigates to recipe detail on click', async () => {
      const user = userEvent.setup()
      renderWithRouter(<RecipeCard recipe={mockRecipe} />)

      const card = screen.getByRole('button')
      await user.click(card)

      expect(mockNavigate).toHaveBeenCalledWith('/recipes/chocolate-chip-cookies')
    })

    it('is keyboard accessible', async () => {
      const user = userEvent.setup()
      renderWithRouter(<RecipeCard recipe={mockRecipe} />)

      const card = screen.getByRole('button')
      card.focus()
      await user.keyboard('{Enter}')

      expect(mockNavigate).toHaveBeenCalledWith('/recipes/chocolate-chip-cookies')
    })

    it('has hover effect', () => {
      const { container } = renderWithRouter(<RecipeCard recipe={mockRecipe} />)
      const card = container.querySelector('.hover\\:shadow-lg')
      expect(card).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has clickable card with role button', () => {
      renderWithRouter(<RecipeCard recipe={mockRecipe} />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('includes servings icon for visual users', () => {
      renderWithRouter(<RecipeCard recipe={mockRecipe} />)
      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('handles long recipe names', () => {
      const longRecipe = {
        ...mockRecipe,
        name: 'Very Long Recipe Name That Should Be Truncated With Ellipsis When Displayed',
      }
      renderWithRouter(<RecipeCard recipe={longRecipe} />)
      const nameElement = screen.getByText(longRecipe.name)
      expect(nameElement).toHaveClass('line-clamp-2')
    })

    it('handles long descriptions', () => {
      const longDescRecipe = {
        ...mockRecipe,
        description: 'A very long description that goes on and on with lots of details about the recipe and how delicious it is and why you should make it',
      }
      renderWithRouter(<RecipeCard recipe={longDescRecipe} />)
      // Description should be truncated with ellipsis
      const descElement = screen.getByText(/A very long description that goes on and on with lots of details about the recipe and how delicious it is and why you\.\.\./)
      expect(descElement).toHaveClass('line-clamp-3')
    })

    it('handles recipe with ID 0', () => {
      const recipeWithZeroId = { ...mockRecipe, id: 0, slug: 'zero-id-recipe' }
      renderWithRouter(<RecipeCard recipe={recipeWithZeroId} />)

      const card = screen.getByRole('button')
      card.click()

      expect(mockNavigate).toHaveBeenCalledWith('/recipes/zero-id-recipe')
    })
  })
})
