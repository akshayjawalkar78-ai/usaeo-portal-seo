import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTop from '@/components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Competitions from './pages/Competitions';
import QuizBowl from './pages/QuizBowl';
import Essay from './pages/Essay';
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
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from './pages/Unauthorized';
import QuizBowlRegister from './pages/QuizBowlRegister';
import EssayRegister from './pages/EssayRegister';
import ChapterRegister from './pages/ChapterRegister';
import Legal from './pages/Legal';

// Redirect ?code= on non-callback pages to /auth/callback so PKCE exchange runs there
function CodeRedirect({ element }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  if (params.has('code') && location.pathname !== '/auth/callback' && location.pathname !== '/auth/reset-password') {
    return <Navigate to={`/auth/callback${location.search}`} replace />;
  }
  return element;
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public */}
            <Route path="/" element={<CodeRedirect element={<Home />} />} />
            <Route path="/about" element={<About />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/competitions/quiz-bowl" element={<QuizBowl />} />
            <Route path="/competitions/essay" element={<Essay />} />
            <Route path="/competitions/qualifiers" element={<NationalQualifiers />} />
            <Route path="/competitions/finals" element={<NationalFinals />} />
            <Route path="/register/quiz-bowl" element={<QuizBowlRegister />} />
            <Route path="/register/essay" element={<EssayRegister />} />
            <Route path="/register/chapter" element={<ChapterRegister />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/research" element={<Research />} />
            <Route path="/chapters" element={<Chapters />} />
            <Route path="/team" element={<Team />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/legal" element={<Legal />} />

            {/* Authed */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Admin only */}
            <Route element={<ProtectedRoute requireRole="admin" />}>
              <Route path="/admin" element={<Admin />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
