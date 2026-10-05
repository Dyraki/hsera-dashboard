import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './presentation/context/AuthContext';
import { ErrorBoundary } from './presentation/components/ui/ErrorBoundary';
import { ToastProvider } from './presentation/context/ToastContext';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
