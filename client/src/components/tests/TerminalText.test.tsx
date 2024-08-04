import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import TerminalText from '../TerminalText';

describe('TerminalText', () => {
  test('Displays text', () => {
    const mockText = 'a';
    const mockKey = 'terminalText1';
    const mockRef = createRef<HTMLDivElement>();

    render(<TerminalText text={mockText} key={mockKey} ref={mockRef} />);
    const terminalText = screen.getByText(mockText);
    expect(terminalText).toBeInTheDocument();
  });
});
