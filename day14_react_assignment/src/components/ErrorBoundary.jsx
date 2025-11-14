import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError)
      return (
        <div className="alert alert-danger">
          Something went wrong! <button className="btn btn-warning btn-sm" onClick={() => this.setState({hasError:false})}>Try Again</button>
        </div>
      );
    return this.props.children;
  }
}

export default ErrorBoundary;
