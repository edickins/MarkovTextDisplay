import { render, screen } from '@testing-library/react';
import TextContainer from '../TextContainer';

describe('TextContainer', () => {
  test('Fetches text and displays an item on load', async () => {
    render(<TextContainer />);
    await screen.findByText('the quick brown fox jumped over the lazy dog', {
      exact: false
    });
  });
});
