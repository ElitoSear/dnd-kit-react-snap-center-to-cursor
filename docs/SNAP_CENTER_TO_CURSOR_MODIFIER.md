# snapCenterToCursor Modifier

The `snapCenterToCursor` modifier centers drag overlays on the cursor position during a drag operation. It automatically detects the overlay element size from the DOM, but you can optionally provide explicit dimensions.

## Basic Usage (Auto-detection)

```tsx
import { DragDropProvider } from '@dnd-kit/react';
import { snapCenterToCursor } from '@dnd-kit/react-snap-center-to-cursor';

function App() {
  return (
    <DragDropProvider
      modifiers={[
        snapCenterToCursor()
      ]}
    >
      {/* Your draggable and droppable components */}
    </DragDropProvider>
  );
}
```

## Usage with Explicit Dimensions

If you want to override the auto-detected size:

```tsx
<DragDropProvider
  modifiers={[
    snapCenterToCursor({ width: 160, height: 40 })
  ]}
>
  {/* ... */}
</DragDropProvider>
```

## Configuration

The `snapCenterToCursor` function accepts an optional options object:

### Options

- `width?: number` - Width of the drag overlay element in pixels. If not provided, automatically detects from DOM.
- `height?: number` - Height of the drag overlay element in pixels. If not provided, automatically detects from DOM.
- `overlaySelector?: string` - CSS selector to find the overlay element. Defaults to `[role="presentation"]`.

## How It Works

The modifier transforms the drag operation coordinates by subtracting half the width and height from the cursor position. This centers the overlay on the cursor.

Formula:
```
x = cursorX - (width / 2)
y = cursorY - (height / 2)
```

When width or height is not provided, the modifier queries the DOM using the overlay selector (defaults to `[role="presentation"]`) and uses the element's computed dimensions.

## Custom Overlay Selector

If your DragOverlay component doesn't use the default `[role="presentation"]` attribute, you can specify a custom selector:

```tsx
<DragDropProvider
  modifiers={[
    snapCenterToCursor({ overlaySelector: '.my-custom-overlay' })
  ]}
>
  {/* ... */}
</DragDropProvider>
```

## Class-Based Usage

For advanced use cases, you can use the `SnapCenterToCursor` class directly:

```tsx
import { SnapCenterToCursor } from '@dnd-kit/react-snap-center-to-cursor';

const modifier = SnapCenterToCursor.configure({
  width: 160,
  height: 40,
});
```

## Notes

- This is a pure modifier and does not require React context or provider setup
- Works with @dnd-kit/react v0.5.0 and above
- Can be combined with other modifiers in the `modifiers` array
