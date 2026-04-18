import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Home from './pages/Home';
import About from './pages/About';
import Competitions from './pages/Competitions';
import IEO from './pages/IEO';
import Workshops from './pages/Workshops';
import Curriculum from './pages/Curriculum';
import Research from './pages/Research';
import Chapters from './pages/Chapters';
import Team from './pages/Team';
import Partners from './pages/Partners';
import Dashboard from './pages/Dashboard';
import NationalQualifiers from './pages/NationalQualifiers';
import NationalFinals from './pages/NationalFinals';
import Admin from './pages/Admin';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/competitions" element={<Competitions />} />
      <Route path="/competitions/ieo" element={<IEO />} />
      <Route path="/workshops" element={<Workshops />} />
      <Route path="/curriculum" element={<Curriculum />} />
      <Route path="/research" element={<Research />} />
      <Route path="/chapters" element={<Chapters />} />
      <Route path="/team" element={<Team />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/competitions/qualifiers" element={<NationalQualifiers />} />
      <Route path="/competitions/finals" element={<NationalFinals />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
