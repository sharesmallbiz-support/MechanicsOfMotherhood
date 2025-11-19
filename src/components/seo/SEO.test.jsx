import { describe, it, expect, afterEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import SEO from './SEO'

const renderWithHelmet = (props) => {
  const helmetContext = {}
  render(
    <HelmetProvider context={helmetContext}>
      <SEO {...props} />
    </HelmetProvider>
  )
  return helmetContext
}

afterEach(() => {
  document.head.innerHTML = ''
  document.title = ''
})

describe('SEO component', () => {
  const getTitle = () => document.head.querySelector('title')?.textContent || ''

  it('applies default metadata when no props are provided', async () => {
    renderWithHelmet()

    await waitFor(() => {
      expect(getTitle()).toContain('Mechanics of Motherhood')
      expect(document.querySelector('meta[name="description"]').content)
        .toContain('Discover delicious family recipes')
      expect(document.querySelector('meta[property="og:type"]').content).toBe('website')
      expect(document.querySelector('meta[property="og:image"]').content)
        .toContain('/images/logos/MOM-Logo-Full.png')
    })
  })

  it('renders canonical, keywords, author, and robots tags when supplied', async () => {
    renderWithHelmet({
      title: 'Chocolate Mousse',
      description: 'Silky dessert',
      canonical: '/recipes/chocolate-mousse',
      keywords: ['dessert', 'chocolate'],
      author: 'mechanics-team',
      image: 'https://cdn.example.com/mousse.jpg',
      type: 'article',
      noindex: true,
    })

    await waitFor(() => {
      expect(getTitle()).toContain('Chocolate Mousse | Mechanics of Motherhood')
      expect(document.querySelector('link[rel="canonical"]').href)
        .toBe('https://mechanicsofmotherhood.com/recipes/chocolate-mousse')
      expect(document.querySelector('meta[name="keywords"]').content)
        .toBe('dessert, chocolate')
      expect(document.querySelector('meta[name="author"]').content)
        .toBe('mechanics-team')
      expect(document.querySelector('meta[name="robots"]').content)
        .toBe('noindex, nofollow')
      expect(document.querySelector('meta[property="og:type"]').content).toBe('article')
      expect(document.querySelector('meta[property="og:image"]').content)
        .toBe('https://cdn.example.com/mousse.jpg')
      expect(document.querySelector('meta[name="twitter:creator"]').content)
        .toBe('@mechanics-team')
    })
  })
})
