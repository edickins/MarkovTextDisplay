import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../TextContainerErrorBoundary';

const ErrorThrowingComponent = () => {
  throw new Error('there has been an error');
};

describe('ErrorBoundary displays an error if it is thrown by a child component', () => {
  test('Message is displayed when child throws an error', () => {
    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );

    const errorText = screen.getByText('Something went wrong');
    expect(errorText).toBeInTheDocument();
  });
});
