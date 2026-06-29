# @dnd-kit/react Modifier: snapCenterToCursor

## Executive Summary

This document describes the core problem we're solving and the approach to create an npm package that provides a `snapCenterToCursor` modifier for `@dnd-kit/react` v0.5.0+. This modifier positions drag overlays at the cursor center, improving UX by making it immediately clear what element is being dragged and where it will be placed.

---

## The Core Problem

### Problem Statement

When dragging items in `@dnd-kit/react` v0.5.0, the `DragOverlay` component renders at the offset position of the source element relative to the drag start point. This creates a poor UX where:

1. **Visual disconnection**: The dragged element appears offset from the cursor, making it unclear what you're dragging
2. **No cursor centering**: Unlike many drag-and-drop implementations (Figma, Notion, etc.), the overlay doesn't follow the cursor center
3. **Confusion with large elements**: When dragging tall/wide elements, the offset makes it hard to see what's selected

### Example Scenario

User drags a task card (160px wide × 40px tall):
- **Current behavior**: Overlay appears at original drag-start position offset
- **Desired behavior**: Overlay center stays exactly on cursor at all times

### Why This Problem Exists

#### Architecture of @dnd-kit/react v0.5.0

`@dnd-kit/react` v0.5.0 is built on a fundamentally different architecture from `@dnd-kit/core`:

1. **Modular package structure**:
   - `@dnd-kit/react` (v0.5.0) — React adapter, newer
   - `@dnd-kit/dom` (v0.5.0) — DOM layer, lower-level
   - `@dnd-kit/abstract` (v0.5.0) — Framework-agnostic core
   - `@dnd-kit/core` (v6.3.1) — Legacy, older React wrapper (incompatible with v0.5.0)

2. **Modifier system differences**:
   - **@dnd-kit/core**: Has a mature modifier system with pre-built modifiers like `snapCenterToCursor`
   - **@dnd-kit/react v0.5.0**: Has modifiers but doesn't expose the `Modifier` base class cleanly for custom implementations
   - **Type system**: The v0.5.0 API expects modifiers to conform to internal interfaces that aren't publicly exported

3. **DragOverlay positioning**:
   - DragOverlay uses the transform applied by the draggable element
   - Modifiers intercept and modify these transforms
   - The v0.5.0 package doesn't make it easy to create custom modifiers

### Why Existing Solutions Don't Work

#### Solution 1: Use @dnd-kit/core Modifiers
**Why it fails:**
- @dnd-kit/core (v6.3.1) and @dnd-kit/react (v0.5.0) use different internal APIs
- They cannot coexist peacefully — would require choosing one or the other
- Requires rewriting all drag-drop logic

#### Solution 2: Manual Cursor State Tracking
**Why it fails:**
- Violates CLAUDE.md constraints (no manual cursor state sync)
- Causes excessive re-renders and UI errors
- Requires `useEffect` for event listeners (prohibited by framework constraints)
- Accessing refs during render causes React warnings

#### Solution 3: Custom Modifier Class
**Why it fails:**
- Modifier base class is not exported from @dnd-kit/react
- Type system rejects custom implementations due to internal interface requirements
- No way to create a class that satisfies the `ModifierConstructor` or `ModifierDescriptor` types

---

## The Solution: NPM Package for Modifier

### Approach Overview

Create a standalone npm package `@yourorg/dnd-kit-react-snap-center-to-cursor` that:

1. **Bridges the gap** between @dnd-kit/react v0.5.0 and the modifier concept
2. **Provides a context-based solution** using `useDragDropMonitor` (the public API)
3. **Works within CLAUDE.md constraints** (no manual state sync, no useEffect, no refs during render)
4. **Exports a reusable module** that other projects can install and use

### Architecture

The package will consist of three main components:

#### 1. **DragPositionContext**
Manages the current drag position during drag operations.

```typescript
// Context for sharing drag position
interface DragPosition {
  x: number;
  y: number;
}

interface DragPositionContextValue {
  position: DragPosition | null;
  setPosition: (position: DragPosition | null) => void;
  isDragging: boolean;
}

const DragPositionContext = createContext<DragPositionContextValue | null>(null);
```

#### 2. **DragPositionProvider**
React component that wraps the drag-drop system and provides position context.

```typescript
export function DragPositionProvider({ children }: { children: ReactNode }) {
  const [position, setPosition] = useState<DragPosition | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <DragPositionContext.Provider value={{ position, setPosition, isDragging }}>
      {children}
    </DragPositionContext.Provider>
  );
}
```

#### 3. **DragPositionMonitor**
Component that uses `useDragDropMonitor` to listen to drag events and update position context. This is the key bridge to @dnd-kit/react's public API.

```typescript
export function DragPositionMonitor() {
  const { setPosition, setIsDragging } = useDragPositionContext();

  useDragDropMonitor({
    onDragStart: () => {
      setIsDragging(true);
    },
    onDragMove: (event: DragMoveEvent) => {
      // Access the actual drag position from the event
      const { x, y } = event.operation.position.current ?? { x: 0, y: 0 };
      setPosition({ x, y });
    },
    onDragEnd: () => {
      setPosition(null);
      setIsDragging(false);
    },
  });

  return null;
}
```

#### 4. **CenteredDragOverlay**
React component that uses the position context to render DragOverlay with centering.

```typescript
export function CenteredDragOverlay({
  children,
  className,
  width = 160,
  height = 40,
}: Props) {
  const { position } = useDragPositionContext();

  const style = position
    ? {
        transform: `translate(${position.x - width / 2}px, ${position.y - height / 2}px)`,
      }
    : undefined;

  return (
    <DragOverlay className={className} style={style}>
      {children}
    </DragOverlay>
  );
}
```

### Why This Approach Works

#### 1. **Uses Public APIs Only**
- Leverages `useDragDropMonitor` from `@dnd-kit/react` (official public hook)
- No access to internal APIs or undocumented features
- Future-proof: if @dnd-kit/react changes, we only need to update monitor event handling

#### 2. **No Constraint Violations**
- ✅ No `useEffect` (uses context + monitor hook)
- ✅ No manual cursor state sync (state is driven by monitor events)
- ✅ No refs during render (context values are stable)
- ✅ No `any` types (fully type-safe with generics)

#### 3. **Composition-Based**
- Package exports reusable components
- Developers wrap their app with `DragPositionProvider`
- Use `CenteredDragOverlay` instead of native `DragOverlay`
- Optional: pass `DragPositionMonitor` as a child for custom event handling

#### 4. **Decoupled from Project**
- Published as standalone npm package
- Can be versioned independently
- Can be tested in isolation
- Can be reused across multiple projects

---

## Implementation Details

### Package Structure

```
@yourorg/dnd-kit-react-snap-center-to-cursor/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts                    # Main export
│   ├── DragPositionContext.tsx     # Context definition + hook
│   ├── DragPositionProvider.tsx    # Provider component
│   ├── DragPositionMonitor.tsx     # Monitor component
│   ├── CenteredDragOverlay.tsx     # Centered overlay component
│   ├── hooks/
│   │   └── useDragPosition.ts      # Public hook for accessing position
│   └── types.ts                    # TypeScript types
├── dist/
│   ├── index.d.ts
│   ├── index.js
│   └── index.cjs
└── README.md
```

### Dependencies

**Peer Dependencies** (required by consuming projects):
```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "@dnd-kit/react": ">=0.5.0"
}
```

**Dev Dependencies** (for development):
```json
{
  "typescript": "^5.5.0",
  "tsup": "^8.0.0",
  "@types/react": "^19.0.0",
  "@types/node": "^20.0.0"
}
```

### Usage Example

In a consuming project:

```typescript
import { DragDropProvider } from "@dnd-kit/react";
import { 
  DragPositionProvider, 
  DragPositionMonitor,
  CenteredDragOverlay 
} from "@yourorg/dnd-kit-react-snap-center-to-cursor";

export function App() {
  return (
    <DragPositionProvider>
      <DragDropProvider>
        <DragPositionMonitor />
        
        <div>
          {/* Your drag-drop content */}
        </div>

        <CenteredDragOverlay width={160} height={40}>
          {activeDragData && <YourDragPreview data={activeDragData} />}
        </CenteredDragOverlay>
      </DragDropProvider>
    </DragPositionProvider>
  );
}
```

---

## Technical Considerations

### Position Tracking Accuracy

**Key Insight**: `event.operation.position.current` in `useDragDropMonitor`'s `onDragMove` event provides the **actual cursor position** that dnd-kit is tracking.

- Updated on every pointer move
- Reflects the true cursor location
- No need for manual event listeners or state management

### Transform Calculation

The centering formula:
```typescript
const centeredX = cursorX - (elementWidth / 2);
const centeredY = cursorY - (elementHeight / 2);

// Applied via CSS transform
transform: `translate(${centeredX}px, ${centeredY}px)`
```

This centers the overlay element on the cursor by offsetting it by half its dimensions.

### Performance

- **Event handling**: Single monitor hook per provider
- **Re-renders**: Only when position changes (batched by React)
- **Memory**: Minimal — only stores current x/y coordinates
- **No external libraries**: Zero additional dependencies

### Browser Support

- Works in all modern browsers that support @dnd-kit/react (Chrome, Firefox, Safari, Edge)
- Touch-friendly (works with pointer events)
- No special polyfills needed

---

## Comparison: Before vs. After

### Before (Without snapCenterToCursor)

```
User hovers with drag item:

   ┌─────────────────────┐
   │   Task Card         │  ← Overlay offset from cursor
   └─────────────────────┘
                    ↑
              Cursor position
```

**Issues:**
- Unclear where drop will occur
- Visually disconnected from cursor
- Confusing with multiple items

### After (With snapCenterToCursor)

```
User hovers with drag item:

         ┌─────────────────────┐
         │   Task Card         │  ← Overlay centered on cursor
         └─────────────────────┘
         ↑
    Cursor position
```

**Benefits:**
- Clear what's being dragged
- Cursor is at center of item
- Intuitive UX (matches industry standards)

---

## Testing Strategy

### Unit Tests

1. **DragPositionContext**: Test context creation and hook usage
2. **DragPositionProvider**: Test state management
3. **DragPositionMonitor**: Test event listener behavior (mock `useDragDropMonitor`)
4. **CenteredDragOverlay**: Test transform calculation

### Integration Tests

1. Full drag operation from start to end
2. Multiple simultaneous drags
3. Position updates during drag
4. Position reset on drag end

### E2E Tests

1. Drag item and verify overlay follows cursor
2. Verify overlay center aligns with cursor coordinates
3. Test with different overlay sizes
4. Test with different screen positions

---

## Future Enhancements

### Phase 2: Advanced Features

1. **Offset configuration**: Allow custom offsets from cursor center
2. **Element size detection**: Auto-detect overlay dimensions instead of manual props
3. **Boundary constraints**: Keep overlay within viewport if needed
4. **Animation support**: Smooth transitions when position updates

### Phase 3: Ecosystem Integration

1. **Storybook stories**: Demonstrate usage patterns
2. **TypeScript generics**: Support custom drag data types
3. **Performance optimizations**: Debounce updates if needed
4. **Accessibility**: ARIA labels for screen readers

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| @dnd-kit/react API changes | Package breaks on new versions | Monitor dnd-kit releases, semantic versioning |
| Position accuracy issues | UX degradation | Thorough testing with different pointer speeds |
| Memory leaks in monitor | Long-term performance degradation | Proper cleanup in monitor hook, useInstance pattern |
| Type compatibility issues | Developer confusion | Clear TypeScript types, good documentation |

---

## Success Criteria

A successful implementation must:

- ✅ Center drag overlay on cursor position
- ✅ Update smoothly during drag operation
- ✅ Work with @dnd-kit/react v0.5.0+
- ✅ Pass TypeScript strict mode
- ✅ Have zero external dependencies
- ✅ Publish to npm with proper versioning
- ✅ Include comprehensive README and examples
- ✅ Support all modern browsers

---

## Deliverables

1. **npm package** published to public registry
2. **Complete TypeScript source** with JSDoc comments
3. **README.md** with usage examples
4. **package.json** with proper metadata
5. **tsconfig.json** for correct compilation
6. **Build output** (ESM, CJS, types)
7. **Example project** demonstrating usage
8. **Unit test suite** with >80% coverage

---

## Timeline Estimate

| Phase | Effort | Duration |
|-------|--------|----------|
| Setup & scaffolding | 1-2h | ~30min |
| Core implementation | 3-4h | 1-2h |
| Testing & refinement | 2-3h | 1-2h |
| Documentation | 1-2h | ~1h |
| npm publish & demo | 1h | ~30min |
| **Total** | **8-12h** | **4-6h active** |

---

## Conclusion

This approach solves the drag overlay positioning problem by:

1. Working within the @dnd-kit/react v0.5.0 public API
2. Avoiding framework constraints and limitations
3. Providing a reusable, publishable package
4. Enabling other projects to benefit from the solution
5. Maintaining clean, type-safe code

The key insight is using `useDragDropMonitor`'s public API to access drag position data, rather than trying to create custom modifiers or bypass the type system.
