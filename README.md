# Mechanics of Motherhood - Recipe & CMS Web Application

A modern React web application for browsing recipes and displaying dynamic CMS content, powered by the WebSpark API.

## Features

- Browse and search recipes
- Filter recipes by category
- View detailed recipe information
- Dynamic CMS pages
- Responsive design with Tailwind CSS
- Server state management with React Query
- Client-side routing with React Router

## Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Zustand** - Global client state
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **DOMPurify** - HTML sanitization

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── api/              # API client and functions
├── components/       # React components
│   ├── common/      # Reusable components
│   ├── layout/      # Layout components
│   ├── recipes/     # Recipe-related components
│   └── cms/         # CMS components
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── routes/          # Routing configuration
├── store/           # State management
└── utils/           # Utility functions
```

## API Configuration

The application connects to the WebSpark API at:
`https://webspark.markhazleton.com/api`

Website ID is configured in the Zustand store (default: 1)

## License

All rights reserved.
