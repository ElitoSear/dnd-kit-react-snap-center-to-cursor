import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DragPositionProvider, useDragPosition } from '../index';

function TestComponent() {
  const { position, isDragging } = useDragPosition();
  return (
    <div>
      <div data-testid="position">
        {position ? `${position.x},${position.y}` : 'null'}
      </div>
      <div data-testid="dragging">{isDragging ? 'dragging' : 'idle'}</div>
    </div>
  );
}

describe('useDragPosition', () => {
  it('throws error when used outside provider', () => {
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useDragPosition must be used within a DragPositionProvider');
  });

  it('returns context value inside provider', () => {
    render(
      <DragPositionProvider>
        <TestComponent />
      </DragPositionProvider>
    );

    expect(screen.getByTestId('position')).toHaveTextContent('null');
    expect(screen.getByTestId('dragging')).toHaveTextContent('idle');
  });
});
