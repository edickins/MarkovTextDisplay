import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import TerminalText from '../TerminalText';

describe('TerminalText', () => {
  test('Displays text correctly', () => {
    const mockText = 'a quick brown fox jumped over the lazy dog';
    render(<TerminalText text={mockText} removeMe={vi.fn()} />);
    const terminalText = screen.getByText(mockText);
    expect(terminalText).toBeInTheDocument();
  });
});
