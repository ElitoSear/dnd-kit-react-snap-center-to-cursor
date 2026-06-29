import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DragPositionProvider, useDragPosition } from '../index';

function StateDisplay() {
  const { position, isDragging, setPosition, setIsDragging } = useDragPosition();

  return (
    <div>
      <div data-testid="position">
        {position ? `${position.x},${position.y}` : 'null'}
      </div>
      <div data-testid="dragging">{isDragging ? 'true' : 'false'}</div>
      <button
        onClick={() => {
          setPosition({ x: 100, y: 200 });
          setIsDragging(true);
        }}
      >
        Set Position
      </button>
      <button
        onClick={() => {
          setPosition(null);
          setIsDragging(false);
        }}
      >
        Reset
      </button>
    </div>
  );
}

describe('DragPositionProvider', () => {
  it('provides initial state', () => {
    render(
      <DragPositionProvider>
        <StateDisplay />
      </DragPositionProvider>
    );

    expect(screen.getByTestId('position')).toHaveTextContent('null');
    expect(screen.getByTestId('dragging')).toHaveTextContent('false');
  });

  it('updates position and dragging state', async () => {
    const user = userEvent.setup();
    const { getByText, getByTestId } = render(
      <DragPositionProvider>
        <StateDisplay />
      </DragPositionProvider>
    );

    const setButton = getByText('Set Position');
    await user.click(setButton);

    expect(getByTestId('position')).toHaveTextContent('100,200');
    expect(getByTestId('dragging')).toHaveTextContent('true');
  });

  it('resets state', async () => {
    const user = userEvent.setup();
    const { getByText, getByTestId } = render(
      <DragPositionProvider>
        <StateDisplay />
      </DragPositionProvider>
    );

    await user.click(getByText('Set Position'));
    expect(getByTestId('dragging')).toHaveTextContent('true');

    await user.click(getByText('Reset'));
    expect(getByTestId('position')).toHaveTextContent('null');
    expect(getByTestId('dragging')).toHaveTextContent('false');
  });
});
