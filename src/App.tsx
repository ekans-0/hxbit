import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading HXBIT...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={session ? <Dashboard /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/auth"
            element={!session ? <Auth /> : <Navigate to="/dashboard" replace />}
          />
        </Routes>
      </Router>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1F2937',
            color: '#FFFFFF',
            border: '1px solid #374151',
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;