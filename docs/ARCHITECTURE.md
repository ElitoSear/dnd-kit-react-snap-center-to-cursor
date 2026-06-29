# Architecture & Type System

## Type Sourcing

All types used in this package come from one of two sources:

### 1. React Types
- From the `react` package
- Built-in types like `ReactNode`, `CSSProperties`, etc.
- All prefixed with `React.` or imported as `type React`

### 2. @dnd-kit/react Types
- From the `@dnd-kit/react` package (version 0.5.0+)
- Event types: `DragStartEvent`, `DragMoveEvent`, `DragEndEvent`
- Component types: `DragOverlay`
- Hook: `useDragDropMonitor`

### Custom Types
We define minimal custom types only for:
- `DragPosition` - wrapper around position coordinates
- `DragPositionContextValue` - context shape
- `CenteredDragOverlayProps` - component props

These are documented in [src/types.ts](src/types.ts).

## Component Hierarchy

```
DragPositionProvider (manages state)
├── DragPositionMonitor (listens to @dnd-kit/react events)
│   └── uses useDragDropMonitor from @dnd-kit/react
│       └── accesses event.operation.position.current
│
├── Your App Content
│
└── CenteredDragOverlay (renders @dnd-kit/react's DragOverlay)
    └── applies transform based on position from context
```

## Data Flow

1. **User initiates drag** via @dnd-kit/react's Draggable component
2. **DragPositionMonitor** receives event via `useDragDropMonitor` hook
3. **Monitor extracts position** from `event.operation.position.current`
4. **Monitor updates context** via `setPosition()`
5. **CenteredDragOverlay** re-renders with new position
6. **Transform applied** to center overlay on cursor

```
Draggable (user interaction)
    ↓
useDragDropMonitor (event listener)
    ↓
event.operation.position.current (position from @dnd-kit/react)
    ↓
setPosition() (context update)
    ↓
CenteredDragOverlay (re-render)
    ↓
transform: translate(...) (CSS)
```

## API Boundaries

### What we consume from @dnd-kit/react
- `DragDropProvider` - wrapper component (used by consuming apps)
- `Draggable` - draggable item component (used by consuming apps)
- `Droppable` - droppable zone component (used by consuming apps)
- `DragOverlay` - overlay component (used internally)
- `useDragDropMonitor()` - hook to listen to drag events (used internally)
- Event types: `DragStartEvent`, `DragMoveEvent`, `DragEndEvent`

### What we don't use
- Custom modifier classes (not available as public API in v0.5.0)
- Internal modifier system
- Any private/internal APIs

### What we export
- `DragPositionProvider` - React component
- `DragPositionMonitor` - React component
- `CenteredDragOverlay` - React component
- `useDragPosition()` - React hook
- Types: `DragPosition`, `DragPositionContextValue`, `CenteredDragOverlayProps`

## Dependencies

### Peer Dependencies (required by consuming projects)
```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "@dnd-kit/react": ">=0.5.0"
}
```

These are NOT bundled with our package. Consumers must install them separately.

### Dev Dependencies (for development/testing only)
```json
{
  "@dnd-kit/react": "^0.5.0",     // For type checking during development
  "react": "^18.2.0",              // For type checking during development
  "react-dom": "^18.2.0",          // For type checking during development
  "typescript": "^5.5.0",          // For compilation
  "vitest": "^1.0.0",              // For testing
  "@testing-library/react": "^14.0.0",  // For component testing
  // ... other dev tools
}
```

These are ONLY used during development and testing. They do NOT appear in the published npm package.

### Runtime Dependencies (bundled)
**ZERO** - This package has no runtime dependencies beyond peer dependencies.

## Compilation & Type Generation

### TypeScript Compilation (tsup)
1. Reads `src/**/*.ts(x)` files
2. Compiles to:
   - ESM: `dist/index.js`
   - CJS: `dist/index.cjs`
3. Generates type declarations:
   - TypeScript: `dist/index.d.ts`
   - Source maps: `dist/index.d.ts.map`, `dist/*.js.map`

### Type Declaration Generation
```
src/types.ts
    ↓
TypeScript compiler
    ↓
dist/index.d.ts (bundled declarations)
```

All custom types are included in the `.d.ts` file that consumers receive.

## Testing

### Test Environment
- **Framework:** Vitest with jsdom
- **Component testing:** React Testing Library
- **All tests can access:** @dnd-kit/react types and mock implementations

### Types in Tests
```typescript
// Tests import from @dnd-kit/react for type information
import { useDragDropMonitor, type DragMoveEvent } from '@dnd-kit/react';

// We mock the events to match the real @dnd-kit/react types
const mockEvent: DragMoveEvent = {
  operation: {
    position: { current: { x: 100, y: 200 } }
  }
};
```

## Publishing to npm

### What gets published
Only files listed in `package.json` `"files"` array:
- `dist/` - Compiled JavaScript and TypeScript declarations
- `README.md` - Documentation
- `LICENSE` - License file

### Excluded from publishing
- `src/` - Source TypeScript files (compiled)
- `examples/` - Example projects
- `tsconfig.json`, `vitest.config.ts` - Config files
- `node_modules/` - Dependencies
- All test files
- All git files

### Type Safety for Consumers
When consumers install this package:
1. They get the compiled JavaScript (`dist/index.js`, `dist/index.cjs`)
2. They get TypeScript declarations (`dist/index.d.ts`)
3. They can use it with full type support in their TypeScript code
4. The declarations reference types from `react` and `@dnd-kit/react` (which they have as peer dependencies)

## Version Compatibility

### Guaranteed Compatibility
- **React:** 18.0.0 or higher
- **react-dom:** 18.0.0 or higher
- **@dnd-kit/react:** 0.5.0 or higher

### Tested Against
- Latest versions of all peer dependencies
- Node.js 18+

### Future Updates
- When @dnd-kit/react releases v0.6.0 or later, we may need to:
  - Update type imports if event shapes change
  - Update event handling in `DragPositionMonitor`
  - Test and increment our major version if breaking changes

## Security Considerations

1. **No eval or dynamic code execution**
2. **No external API calls** - stays in-browser
3. **No sensitive data handling** - only cursor coordinates
4. **All dependencies are explicit** - no hidden transitive dependencies
5. **Types are from trusted sources** - React and dnd-kit packages only
