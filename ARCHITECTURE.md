# Architecture

## Project Overview

StarryCrypt is a modern, secure cryptography toolkit built with React and TypeScript. It provides a user-friendly interface for performing various cryptographic operations while maintaining security best practices.

## Technology Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI Component Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **Code Quality**: ESLint, Prettier
- **Package Manager**: npm

## Directory Structure

```
starrycrypt/
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/              # Page-level components
│   ├── utils/              # Utility functions and helpers
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # Global styles and theme
│   └── App.tsx             # Main application component
├── public/                 # Static assets
├── tests/                  # Unit and integration tests
├── .github/                # GitHub configuration and workflows
├── docs/                   # Documentation files
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # Project overview
```

## Component Architecture

### Component Organization

Components are organized by functionality and responsibility:

- **Layout Components**: Page structure and navigation (Header, Sidebar, Footer)
- **Feature Components**: Domain-specific features (Encryption, Hashing, KeyGeneration)
- **UI Components**: Reusable presentational components (Button, Input, Modal)
- **Utility Components**: Helper components for common patterns

### Component Best Practices

- Use functional components with React hooks
- Keep components focused and single-purpose
- Extract common logic into custom hooks
- Use TypeScript for type safety
- Document complex component props with JSDoc comments

## State Management

The application uses React's built-in state management (hooks and context) for managing component state. For complex global state, consider implementing:

- React Context API for theme and user preferences
- Local component state with `useState` for UI state
- Custom hooks for shared logic

## Cryptographic Operations

All cryptographic operations follow security best practices:

- Use established, battle-tested libraries (never roll-your-own crypto)
- Validate all user inputs before processing
- Clear sensitive data from memory when no longer needed
- Provide clear warnings about security implications
- Include helpful documentation for each operation

## Styling System

The project uses Tailwind CSS with a consistent design system:

- **Color Palette**: Defined in `tailwind.config.ts`
- **Typography**: Standard web-safe fonts with semantic sizing
- **Spacing Scale**: Consistent 4px-based spacing scale
- **Components**: shadcn/ui components for consistency

## Data Flow

```
User Input → Component State → Cryptographic Operation → Result Display
```

1. User interacts with form inputs
2. Component state updates with user data
3. Validation runs on input
4. Cryptographic operation executes
5. Result is displayed and can be copied

## Security Considerations

- **Input Validation**: All user inputs are validated before processing
- **Output Sanitization**: Results are properly encoded for safe display
- **Memory Management**: Sensitive data should be cleared when no longer needed
- **Error Handling**: Graceful error messages without exposing internals
- **HTTPS Only**: Production deployment requires HTTPS

## Performance Optimization

- **Code Splitting**: Routes are lazy-loaded where appropriate
- **Tree Shaking**: Unused code is eliminated in production builds
- **Asset Optimization**: Images and static assets are optimized
- **Memoization**: React.memo and useMemo prevent unnecessary re-renders

## Development Workflow

1. Create a feature branch from `main`
2. Develop and test locally
3. Run linting and type checking: `npm run lint` and `npm run typecheck`
4. Commit with clear messages following the convention
5. Open a pull request for review
6. Address feedback and merge when approved

## Testing Strategy

- **Unit Tests**: Test utility functions and hooks in isolation
- **Component Tests**: Test component rendering and user interactions
- **Integration Tests**: Test feature workflows end-to-end
- **Test Framework**: Vitest or Jest (see DEVELOPMENT.md for details)

## Deployment

- **Development**: `npm run dev` starts a local development server
- **Production Build**: `npm run build` creates an optimized production build
- **Preview**: Built artifacts can be previewed locally with `npm run preview`

See SECURITY.md for production deployment security considerations.
