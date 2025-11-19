import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

// Mock Helmet
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }) => <div data-testid="helmet">{children}</div>,
}));

describe('Breadcrumbs', () => {
  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('renders nothing when items array is empty', () => {
    const { container } = renderWithRouter(<Breadcrumbs items={[]} />);
    expect(container.querySelector('nav')).toBeNull();
  });

  it('renders nothing when items is null', () => {
    const { container } = renderWithRouter(<Breadcrumbs items={null} />);
    expect(container.querySelector('nav')).toBeNull();
  });

  it('renders breadcrumbs with home and additional items', () => {
    const items = [
      { name: 'Recipes', path: '/recipes' },
      { name: 'Chocolate Chip Cookies', path: '/recipes/123' },
    ];

    renderWithRouter(<Breadcrumbs items={items} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Recipes')).toBeInTheDocument();
    expect(screen.getByText('Chocolate Chip Cookies')).toBeInTheDocument();
  });

  it('renders last item without link', () => {
    const items = [
      { name: 'Recipes', path: '/recipes' },
      { name: 'Chocolate Chip Cookies', path: '/recipes/123' },
    ];

    renderWithRouter(<Breadcrumbs items={items} />);

    const lastItem = screen.getByText('Chocolate Chip Cookies');
    expect(lastItem.tagName).toBe('SPAN');
    expect(lastItem).toHaveAttribute('aria-current', 'page');
  });

  it('renders intermediate items as links', () => {
    const items = [
      { name: 'Recipes', path: '/recipes' },
      { name: 'Chocolate Chip Cookies', path: '/recipes/123' },
    ];

    renderWithRouter(<Breadcrumbs items={items} />);

    const homeLink = screen.getByText('Home').closest('a');
    const recipesLink = screen.getByText('Recipes').closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(recipesLink).toHaveAttribute('href', '/recipes');
  });

  it('has proper accessibility attributes', () => {
    const items = [{ name: 'Recipes', path: '/recipes' }];

    renderWithRouter(<Breadcrumbs items={items} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
  });

  it('removes duplicate home entries', () => {
    const items = [
      { name: 'Home', path: '/' },
      { name: 'Recipes', path: '/recipes' },
    ];

    renderWithRouter(<Breadcrumbs items={items} />);

    const homeElements = screen.getAllByText('Home');
    expect(homeElements).toHaveLength(1);
  });
});
