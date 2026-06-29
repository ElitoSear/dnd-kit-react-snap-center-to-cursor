import { DragOverlay } from '@dnd-kit/react';
import { useDragPosition } from './DragPositionContext';
import type { CenteredDragOverlayProps } from './types';

/**
 * A drag overlay component that centers on the cursor position.
 * Wraps @dnd-kit/react's DragOverlay with automatic centering logic.
 *
 * @param width - Overlay width in pixels (used for centering math). Default: 160
 * @param height - Overlay height in pixels (used for centering math). Default: 40
 * @param children - Content to render inside the overlay
 * @param className - CSS class name to apply
 * @param style - Additional inline styles
 *
 * @example
 * ```tsx
 * <CenteredDragOverlay width={200} height={100}>
 *   <YourDragPreview />
 * </CenteredDragOverlay>
 * ```
 */
export function CenteredDragOverlay({
  children,
  className,
  width = 160,
  height = 40,
  style,
}: CenteredDragOverlayProps) {
  const { position } = useDragPosition();

  const centeredStyle: React.CSSProperties | undefined = position
    ? {
        transform: `translate(${position.x - width / 2}px, ${position.y - height / 2}px)`,
        ...style,
      }
    : style;

  return (
    <DragOverlay className={className} style={centeredStyle}>
      {children}
    </DragOverlay>
  );
}
