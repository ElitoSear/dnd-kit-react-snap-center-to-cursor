import { useDragDropMonitor, type DragStartEvent, type DragMoveEvent, type DragEndEvent } from '@dnd-kit/react';
import { useDragPosition } from './DragPositionContext';

/**
 * Monitor component that listens to drag events from @dnd-kit/react
 * and updates the DragPositionContext with the current cursor position.
 *
 * Must be placed inside a DragDropProvider.
 * Place it as a sibling to your main content and DragOverlay.
 *
 * @example
 * Place inside DragDropProvider. It returns null and manages event listening.
 */
export function DragPositionMonitor() {
  const { setPosition, setIsDragging } = useDragPosition();

  useDragDropMonitor({
    onDragStart: (_event: DragStartEvent) => {
      setIsDragging(true);
    },
    onDragMove: (event: DragMoveEvent) => {
      const position = event.operation.position.current;
      if (position) {
        setPosition({ x: position.x, y: position.y });
      }
    },
    onDragEnd: (_event: DragEndEvent) => {
      setPosition(null);
      setIsDragging(false);
    },
  });

  return null;
}
