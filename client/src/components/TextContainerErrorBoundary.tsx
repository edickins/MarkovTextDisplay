import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.log(error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render(): ReactNode {
    const { hasError } = this.state;

    if (hasError) {
      return <h1>Something went wrong</h1>;
    }

    // eslint-disable-next-line react/destructuring-assignment
    return this.props.children;
  }
}

export default ErrorBoundary;
