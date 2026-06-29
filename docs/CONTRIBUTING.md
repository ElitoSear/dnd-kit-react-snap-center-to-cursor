# Contributing to @dnd-kit/react-snap-center-to-cursor

Thank you for considering contributing! Here's how you can help.

## Setting Up Development

```bash
git clone https://github.com/yourorg/dnd-kit-react-snap-center-to-cursor.git
cd dnd-kit-react-snap-center-to-cursor
npm install
```

## Building the Package

```bash
npm run build
```

This generates ESM, CJS, and TypeScript declaration files in the `dist/` directory.

## Development Mode

```bash
npm run dev
```

This watches for changes and rebuilds automatically.

## Running Tests

```bash
# Run all tests
npm test

# Run with UI
npm test:ui

# Run with coverage
npm test:coverage
```

## Running the Example

```bash
cd examples/basic
npm install
npm run dev
```

This starts a local dev server with hot reload to test the package in action.

## Code Style

- Use TypeScript for all source files
- Follow existing code patterns and naming conventions
- Keep components focused and single-responsibility
- Write JSDoc comments for exported functions/components
- No external runtime dependencies (only dev dependencies)

## Testing

- Add tests for new features
- Aim for >80% coverage
- Test both happy paths and edge cases
- Use descriptive test names

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear, descriptive commits
3. Add/update tests as needed
4. Update documentation if behavior changes
5. Ensure all tests pass: `npm test`
6. Ensure type checking passes: `npm run type-check`
7. Submit PR with a clear description

## Reporting Issues

When reporting issues, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- @dnd-kit/react version you're using
- React version
- Browser/environment info

## Future Enhancements

Potential areas for contribution:
- Advanced positioning options (offsets, constraints)
- Animation support
- Accessibility improvements
- Performance optimizations
- Documentation and examples
- Additional test coverage
