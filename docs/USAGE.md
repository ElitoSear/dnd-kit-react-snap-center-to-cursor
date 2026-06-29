# Usage Guide

## Installation

```bash
npm install @dnd-kit/react-snap-center-to-cursor
```

## Basic Setup

Wrap your app with `DragPositionProvider` at the root level:

```typescript
import { DragDropProvider } from "@dnd-kit/react";
import { 
  DragPositionProvider, 
  DragPositionMonitor,
  CenteredDragOverlay 
} from "@dnd-kit/react-snap-center-to-cursor";

export function App() {
  return (
    <DragPositionProvider>
      <DragDropProvider>
        <DragPositionMonitor />
        
        <div className="app">
          {/* Your drag-drop content here */}
        </div>

        <CenteredDragOverlay width={160} height={40}>
          {/* Your drag preview content */}
        </CenteredDragOverlay>
      </DragDropProvider>
    </DragPositionProvider>
  );
}
```

## Components

### DragPositionProvider

Provides drag position context to all child components. Must wrap your entire application.

**Props:**
- `children: ReactNode` - Child components

```typescript
<DragPositionProvider>
  {/* Your app content */}
</DragPositionProvider>
```

### DragPositionMonitor

Listens to drag events and updates position context. Must be placed inside `DragDropProvider`.

```typescript
<DragDropProvider>
  <DragPositionMonitor />
  {/* Your content */}
</DragDropProvider>
```

### CenteredDragOverlay

Renders a centered drag overlay at the cursor position.

**Props:**
- `children?: ReactNode` - Overlay content
- `className?: string` - CSS class name
- `width?: number` - Overlay width for centering (default: 160)
- `height?: number` - Overlay height for centering (default: 40)
- `style?: CSSProperties` - Additional styles

```typescript
<CenteredDragOverlay 
  width={200} 
  height={100}
  className="custom-overlay"
>
  <YourDragPreview />
</CenteredDragOverlay>
```

## Hook: useDragPosition

Access drag position data anywhere inside `DragPositionProvider`.

```typescript
import { useDragPosition } from "@dnd-kit/react-snap-center-to-cursor";

function MyComponent() {
  const { position, isDragging } = useDragPosition();

  return (
    <div>
      {isDragging && position && (
        <div>Dragging at: {position.x}, {position.y}</div>
      )}
    </div>
  );
}
```

**Returns:**
- `position: DragPosition | null` - Current cursor position during drag
- `isDragging: boolean` - Whether a drag is currently active
- `setPosition: (position: DragPosition | null) => void` - Update position (internal use)
- `setIsDragging: (isDragging: boolean) => void` - Update dragging state (internal use)

## Complete Example

```typescript
import { DragDropProvider, Draggable, Droppable } from "@dnd-kit/react";
import { 
  DragPositionProvider, 
  DragPositionMonitor,
  CenteredDragOverlay 
} from "@dnd-kit/react-snap-center-to-cursor";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
}

function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Task 1" },
    { id: "2", title: "Task 2" },
  ]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const activeDrag = tasks.find(t => t.id === activeDragId);

  return (
    <DragPositionProvider>
      <DragDropProvider onDragStart={(event) => setActiveDragId(event.active.id as string)}>
        <DragPositionMonitor />

        <div className="board">
          {tasks.map((task) => (
            <Draggable key={task.id} id={task.id}>
              <div className="task-card">{task.title}</div>
            </Draggable>
          ))}
        </div>

        <CenteredDragOverlay width={160} height={60}>
          {activeDrag && (
            <div className="task-card">{activeDrag.title}</div>
          )}
        </CenteredDragOverlay>
      </DragDropProvider>
    </DragPositionProvider>
  );
}

export default TaskBoard;
```

## Styling the Overlay

The overlay is rendered using `@dnd-kit/react`'s `DragOverlay` component, so you can style it normally:

```css
.drag-overlay {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  opacity: 0.9;
  pointer-events: none;
}
```

```typescript
<CenteredDragOverlay className="drag-overlay">
  {/* Content */}
</CenteredDragOverlay>
```

## Important Notes

1. **Order matters**: Always wrap with `DragPositionProvider` first, then `DragDropProvider`
2. **Place monitor inside DragDropProvider**: `DragPositionMonitor` must be inside `DragDropProvider` to work
3. **Width and height are required for accurate centering**: Provide them based on your drag preview dimensions
4. **No external dependencies**: This package only requires React and @dnd-kit/react

## Troubleshooting

**"useDragPosition must be used within a DragPositionProvider"**
- Make sure your component is wrapped with `DragPositionProvider`
- Check the component hierarchy is correct

**Overlay not showing**
- Verify `DragPositionMonitor` is inside `DragDropProvider`
- Check that `CenteredDragOverlay` is rendered at the root level (after your main content)
- Ensure width/height props match your drag preview dimensions

**Position seems offset**
- Double-check your width and height values
- They should match the dimensions of your drag preview content
