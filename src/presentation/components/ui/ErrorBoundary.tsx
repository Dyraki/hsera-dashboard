import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled application rendering error:', error, info.componentStack);
  }

  private reload = () => window.location.reload();

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
          <section className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-gray-950">Terjadi kesalahan</h1>
            <p className="mt-2 text-sm text-gray-600">Halaman tidak dapat ditampilkan. Muat ulang aplikasi untuk mencoba kembali.</p>
            <button type="button" onClick={this.reload} className="mt-5 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
              Muat ulang
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
