import { useAuth } from './hooks/useAuth';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 dark:text-white text-lg">Loading Hxbit...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      {session ? <Dashboard /> : <Auth />}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            border: '1px solid var(--toast-border)',
          },
        }}
      />
      <style>{`
        :root {
          --toast-bg: #FFFFFF;
          --toast-color: #374151;
          --toast-border: #E5E7EB;
        }
        .dark {
          --toast-bg: #1F2937;
          --toast-color: #FFFFFF;
          --toast-border: #374151;
        }
      `}</style>
    </ThemeProvider>
  );
}

export default App;