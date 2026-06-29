# react-snap-center-to-cursor

[![npm version](https://img.shields.io/npm/v/react-snap-center-to-cursor.svg)](https://www.npmjs.com/package/react-snap-center-to-cursor)
[![npm downloads](https://img.shields.io/npm/dm/react-snap-center-to-cursor.svg)](https://www.npmjs.com/package/react-snap-center-to-cursor)
[![license](https://img.shields.io/npm/l/react-snap-center-to-cursor.svg)](https://github.com/ElitoSear/dnd-kit-react-snap-center-to-cursor/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue.svg)](https://www.typescriptlang.org/)

A minimal, type-safe React hook and components for positioning `@dnd-kit/react` drag overlays centered on the cursor. Works with `@dnd-kit/react` v0.5.0+.

## Features

- ✅ **Type-safe** - Full TypeScript support with strict mode
- ✅ **Minimal** - Zero runtime dependencies, ~2KB minified
- ✅ **Public API only** - Uses official `@dnd-kit/react` APIs
- ✅ **Composition-based** - Reusable components and hooks
- ✅ **Well tested** - Unit tests with Vitest and React Testing Library
- ✅ **Documented** - Comprehensive documentation and JSDoc comments

## Installation

```bash
pnpm add react-snap-center-to-cursor
npm install react-snap-center-to-cursor
yarn add react-snap-center-to-cursor
```

### Peer Dependencies

This package requires:
- `react >= 18.0.0`
- `react-dom >= 18.0.0`
- `@dnd-kit/react >= 0.5.0`

## Quick Start

### 1. Wrap your app with `DragPositionProvider`

```tsx
import { DragDropProvider } from '@dnd-kit/react';
import { DragPositionProvider, DragPositionMonitor, CenteredDragOverlay } from 'react-snap-center-to-cursor';

export function App() {
  return (
    <DragPositionProvider>
      <DragDropProvider>
        <DragPositionMonitor />
        
        {/* Your drag-drop content */}
        <YourContent />

        {/* Centered drag overlay */}
        <CenteredDragOverlay width={160} height={40}>
          {/* Drag preview content */}
        </CenteredDragOverlay>
      </DragDropProvider>
    </DragPositionProvider>
  );
}
```

### 2. Use the `useDragPosition` hook

```tsx
import { useDragPosition } from 'react-snap-center-to-cursor';

function DebugInfo() {
  const { position, isDragging } = useDragPosition();

  return isDragging && position ? (
    <div>Dragging at {position.x}, {position.y}</div>
  ) : null;
}
```

## Components

### `<DragPositionProvider>`

Provides drag position context to child components. Must wrap your entire application.

**Props:**
- `children: ReactNode` - Child components

```tsx
<DragPositionProvider>
  <YourApp />
</DragPositionProvider>
```

### `<DragPositionMonitor>`

Listens to drag events from `@dnd-kit/react` and updates the position context. Must be placed inside `<DragDropProvider>`.

```tsx
<DragDropProvider>
  <DragPositionMonitor />
  {/* Your content */}
</DragDropProvider>
```

### `<CenteredDragOverlay>`

A drag overlay that centers on the cursor position. Wraps `@dnd-kit/react`'s `DragOverlay` component.

**Props:**
- `children?: ReactNode` - Overlay content
- `className?: string` - CSS class name
- `width?: number` - Overlay width for centering (default: 160)
- `height?: number` - Overlay height for centering (default: 40)
- `style?: CSSProperties` - Additional inline styles

```tsx
<CenteredDragOverlay width={200} height={100} className="drag-overlay">
  <YourDragPreview />
</CenteredDragOverlay>
```

## Hooks

### `useDragPosition()`

Access the current drag position and state.

```tsx
const { position, isDragging, setPosition, setIsDragging } = useDragPosition();
```

**Returns:**
- `position: DragPosition | null` - Current cursor position (null if not dragging)
- `isDragging: boolean` - Whether a drag is active
- `setPosition: (position: DragPosition | null) => void` - Update position (internal use)
- `setIsDragging: (isDragging: boolean) => void` - Update dragging state (internal use)

## Types

All types are exported and fully typed:

```tsx
import type { 
  DragPosition, 
  DragPositionContextValue, 
  CenteredDragOverlayProps 
} from 'react-snap-center-to-cursor';
```

## How It Works

1. **DragPositionMonitor** listens to drag events via `useDragDropMonitor` (public API)
2. Position data is extracted from `event.operation.position.current`
3. Position is stored in React Context via `DragPositionProvider`
4. **CenteredDragOverlay** reads position and applies centering transform

```
User drag → @dnd-kit/react event → DragPositionMonitor → Context → CenteredDragOverlay
```

## Examples

### Basic Kanban Board

See the [full documentation](./docs/USAGE.md) for detailed examples.

```tsx
import { Draggable, Droppable } from '@dnd-kit/react';
import { CenteredDragOverlay, useDragPosition } from 'react-snap-center-to-cursor';

function TaskBoard() {
  const { isDragging } = useDragPosition();

  return (
    <div className="board">
      <Droppable id="column-1">
        <Draggable id="task-1">
          <div className="task">Task 1</div>
        </Draggable>
      </Droppable>

      <CenteredDragOverlay width={200} height={60}>
        {isDragging && <div className="task">Task 1</div>}
      </CenteredDragOverlay>
    </div>
  );
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any browser supporting ES2020

## Type Safety

All types are sourced from legitimate packages:
- `React` types from `react` package
- `@dnd-kit/react` types from `@dnd-kit/react` package
- Custom types are minimal and documented

See [TYPE_SOURCING.md](./docs/TYPE_SOURCING.md) for complete type documentation.

## Performance

- **Bundle size**: ~2KB minified (no runtime dependencies)
- **Event handling**: Single monitor per provider instance
- **Re-renders**: Only when position changes (React batched updates)
- **Memory**: O(1) - stores only x/y coordinates

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

## License

MIT © [ElitoSear](https://github.com/ElitoSear)

## Resources

- [Documentation](./docs/)
- [API Reference](./docs/IMPLEMENTATION.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Type System Guide](./docs/TYPE_SOURCING.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)
- [@dnd-kit Documentation](https://docs.dnd-kit.com/)

---

Built with ❤️ using TypeScript and React
