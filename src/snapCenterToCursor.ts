import { Modifier } from '@dnd-kit/abstract';
import type { DragOperation } from '@dnd-kit/abstract';
import type { Coordinates } from '@dnd-kit/geometry';
import type { DragDropManager } from '@dnd-kit/dom';

export interface SnapCenterToCursorOptions {
  /** Width of the drag overlay element. If not provided, automatically detects from DOM. */
  width?: number;
  /** Height of the drag overlay element. If not provided, automatically detects from DOM. */
  height?: number;
  /** Selector for the overlay element. Defaults to '[role="presentation"]' */
  overlaySelector?: string;
}

export class SnapCenterToCursor extends Modifier<DragDropManager, SnapCenterToCursorOptions> {
  apply(operation: DragOperation<any, any>): Coordinates {
    const { transform } = operation;

    if (!transform) {
      return { x: 0, y: 0 };
    }

    let { width, height } = this.options || {};

    if (width === undefined || height === undefined) {
      const overlay = this.getOverlayElement();
      if (overlay) {
        const rect = overlay.getBoundingClientRect();
        if (width === undefined) width = rect.width;
        if (height === undefined) height = rect.height;
      }
    }

    width = width ?? 0;
    height = height ?? 0;

    return {
      x: transform.x - width / 2,
      y: transform.y - height / 2,
    };
  }

  private getOverlayElement(): HTMLElement | null {
    const selector = this.options?.overlaySelector || '[role="presentation"]';
    return document.querySelector(selector) as HTMLElement | null;
  }
}

export function snapCenterToCursor(options: SnapCenterToCursorOptions = {}) {
  return SnapCenterToCursor.configure(options);
}
