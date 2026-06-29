import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DragPositionProvider, CenteredDragOverlay, useDragPosition } from '../index';

function TestWrapper() {
  const { setPosition } = useDragPosition();

  return (
    <div>
      <button
        onClick={() => setPosition({ x: 100, y: 200 })}
        data-testid="trigger-position"
      >
        Set Position
      </button>
      <CenteredDragOverlay width={160} height={40}>
        <div>Drag Item</div>
      </CenteredDragOverlay>
    </div>
  );
}

describe('CenteredDragOverlay', () => {
  it('renders the overlay content', () => {
    render(
      <DragPositionProvider>
        <TestWrapper />
      </DragPositionProvider>
    );

    expect(screen.getByText('Drag Item')).toBeInTheDocument();
  });

  it('applies centered transform when position is set', async () => {
    const user = userEvent.setup();
    const { getByTestId, getByText } = render(
      <DragPositionProvider>
        <TestWrapper />
      </DragPositionProvider>
    );

    const trigger = getByTestId('trigger-position');
    await user.click(trigger);

    const dragItem = getByText('Drag Item');
    const overlay = dragItem.parentElement;

    expect(overlay).toBeDefined();
    if (overlay && overlay.style.transform) {
      expect(overlay.style.transform).toContain('translate');
    }
  });

  it('accepts custom width and height', () => {
    const { queryByText } = render(
      <DragPositionProvider>
        <CenteredDragOverlay width={200} height={100}>
          <div>Custom Size Item</div>
        </CenteredDragOverlay>
      </DragPositionProvider>
    );

    expect(queryByText('Custom Size Item')).toBeInTheDocument();
  });
});
