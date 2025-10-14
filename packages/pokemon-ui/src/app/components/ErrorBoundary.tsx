import React, { Component, ReactNode } from 'react';
import styled from '@emotion/styled';
import { Button, Card, Heading, Text } from './ui';
import { COLORS } from './colors';
import { WarningIcon } from './icons';

interface Props {
  fallback?: React.ComponentType<ErrorFallbackProps>;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retry: () => void;
}


const ErrorContainer = styled(Card)`
  max-width: 600px;
  margin: 40px auto;
  text-align: center;
  border: 2px solid ${COLORS.error};
  background: #FFEBEE;
`;

const ErrorIcon = styled.div`
  margin-bottom: 16px;
  color: ${COLORS.error};
`;

const ErrorTitle = styled(Heading)`
  color: ${COLORS.error};
  margin-bottom: 12px;
`;

const ErrorMessage = styled(Text)`
  margin-bottom: 20px;
  color: ${COLORS.textPrimary};
  font-size: 16px;
`;

const ErrorDetails = styled.details`
  text-align: left;
  margin: 20px 0;
  padding: 12px;
  background: ${COLORS.gray50};
  border-radius: 4px;
  border: 1px solid ${COLORS.gray200};
`;

const ErrorSummary = styled.summary`
  cursor: pointer;
  font-weight: 600;
  color: ${COLORS.textSecondary};
  margin-bottom: 8px;
`;

const ErrorStack = styled.pre`
  font-size: 12px;
  color: ${COLORS.textSecondary};
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  line-height: 1.4;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
`;

function DefaultErrorFallback({ error, errorInfo, retry }: ErrorFallbackProps) {
  const handleReload = () => {
    window.location.reload();
  };

  const handleReportError = () => {
    // In a real app, you'd send this to your error reporting service
    console.error('Error reported:', error, errorInfo);
    alert('Error details have been logged. Thank you for the report!');
  };

  return (
    <ErrorContainer>
      <ErrorIcon>
        <WarningIcon size={48} />
      </ErrorIcon>
      
      <ErrorTitle>Something went wrong</ErrorTitle>
      
      <ErrorMessage>
        We're sorry, but something unexpected happened. The error has been logged and 
        we'll look into it.
      </ErrorMessage>

      {error && (
        <ErrorDetails>
          <ErrorSummary>Error Details</ErrorSummary>
          <ErrorStack>
            <strong>Error:</strong> {error.message}
            {error.stack && (
              <>
                <br /><br />
                <strong>Stack Trace:</strong>
                <br />
                {error.stack}
              </>
            )}
            {errorInfo?.componentStack && (
              <>
                <br /><br />
                <strong>Component Stack:</strong>
                <br />
                {errorInfo.componentStack}
              </>
            )}
          </ErrorStack>
        </ErrorDetails>
      )}

      <ButtonGroup>
        <Button onClick={retry}>
          Try Again
        </Button>
        <Button onClick={handleReload} variant="secondary">
          Reload Page
        </Button>
        <Button onClick={handleReportError} variant="secondary">
          Report Issue
        </Button>
      </ButtonGroup>
    </ErrorContainer>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // In a real app, you'd send this to your error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          retry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

// HOC for easier usage
export function withErrorBoundary<P>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<ErrorFallbackProps>
): React.ComponentType<P> {
  const WrappedComponent: React.ComponentType<P> = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...(props as any)} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}
