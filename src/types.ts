import type React from 'react';

/** Position coordinates from @dnd-kit/react drag monitor events */
export interface DragPosition {
  x: number;
  y: number;
}

/** Context value provided by DragPositionProvider */
export interface DragPositionContextValue {
  /** Current cursor position during drag, null when not dragging */
  position: DragPosition | null;
  /** Update the position (internal use, managed by DragPositionMonitor) */
  setPosition: (position: DragPosition | null) => void;
  /** Whether a drag operation is currently active */
  isDragging: boolean;
  /** Update dragging state (internal use, managed by DragPositionMonitor) */
  setIsDragging: (isDragging: boolean) => void;
}

/** Props for CenteredDragOverlay component */
export interface CenteredDragOverlayProps {
  /** Drag preview content */
  children?: React.ReactNode;
  /** CSS class name to apply to the overlay */
  className?: string;
  /** Overlay width - used for centering calculation */
  width?: number;
  /** Overlay height - used for centering calculation */
  height?: number;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/** Configuration options for snapCenterToCursor modifier */
export interface SnapCenterToCursorOptions {
  /** Width of the drag overlay element */
  width?: number;
  /** Height of the drag overlay element */
  height?: number;
}
