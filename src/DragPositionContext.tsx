import { createContext, useContext } from 'react';
import type { DragPositionContextValue } from './types';

export const DragPositionContext = createContext<DragPositionContextValue | null>(null);

/**
 * Hook to access the current drag position and state.
 * Can only be used inside a DragPositionProvider.
 *
 * @returns DragPositionContextValue containing:
 *   - position: Current cursor position during drag (null if not dragging)
 *   - isDragging: Whether a drag operation is active
 *   - setPosition: Internal method to update position
 *   - setIsDragging: Internal method to update dragging state
 *
 * @throws Error if used outside of DragPositionProvider
 *
 * @example
 * Call this hook to get drag position and state.
 * Must be inside a DragPositionProvider.
 * Returns position (null if not dragging) and isDragging flag.
 */
export function useDragPosition(): DragPositionContextValue {
  const context = useContext(DragPositionContext);
  if (!context) {
    throw new Error(
      'useDragPosition must be used within a DragPositionProvider. ' +
      'Wrap your app with <DragPositionProvider> at the root.'
    );
  }
  return context;
}
