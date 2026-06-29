import { ReactNode, useState } from 'react';
import { DragPositionContext } from './DragPositionContext';
import type { DragPosition } from './types';

interface DragPositionProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages drag position state and provides it to all child components.
 * Must wrap your entire application to enable drag position tracking.
 *
 * This provider creates a context that is accessed by DragPositionMonitor and CenteredDragOverlay.
 *
 * @example
 * Wrap your app with DragPositionProvider:
 * - Place it at the root of your application
 * - Then place DragDropProvider inside it
 * - Use DragPositionMonitor and CenteredDragOverlay as children
 */
export function DragPositionProvider({ children }: DragPositionProviderProps) {
  const [position, setPosition] = useState<DragPosition | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const value = {
    position,
    setPosition,
    isDragging,
    setIsDragging,
  };

  return (
    <DragPositionContext.Provider value={value}>
      {children}
    </DragPositionContext.Provider>
  );
}
