import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import TerminalText from '../TerminalText';

describe('TerminalText', () => {
  test('Displays text', () => {
    const mockText = 'a quick brown fox jumped over the lazy dog';
    const mockKey = 'terminalText1';
    const mockRef = createRef<HTMLDivElement>();

    render(<TerminalText text={mockText} key={mockKey} ref={mockRef} />);
    const terminalText = screen.getByText(mockText);
    expect(terminalText).toBeInTheDocument();
  });
});
