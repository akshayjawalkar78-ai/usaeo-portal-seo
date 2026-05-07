import { lazy, Suspense } from 'react'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { NotificationProvider } from '@/lib/NotificationContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTop from '@/components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';

// Lazy-loaded routes (cuts initial JS for better LCP/TBT)
const About = lazy(() => import('./pages/About'));
const Competitions = lazy(() => import('./pages/Competitions'));
const QuizBowl = lazy(() => import('./pages/QuizBowl'));
const Essay = lazy(() => import('./pages/Essay'));
const Workshops = lazy(() => import('./pages/Workshops'));
const Curriculum = lazy(() => import('./pages/Curriculum'));
const Research = lazy(() => import('./pages/Research'));
const Chapters = lazy(() => import('./pages/Chapters'));
const Team = lazy(() => import('./pages/Team'));
const Partners = lazy(() => import('./pages/Partners'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NationalQualifiers = lazy(() => import('./pages/NationalQualifiers'));
const NationalFinals = lazy(() => import('./pages/NationalFinals'));
const Admin = lazy(() => import('./pages/Admin'));
const Register = lazy(() => import('./pages/Register'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const QuizBowlRegister = lazy(() => import('./pages/QuizBowlRegister'));
const EssayRegister = lazy(() => import('./pages/EssayRegister'));
const ChapterRegister = lazy(() => import('./pages/ChapterRegister'));
const CareersApply = lazy(() => import('./pages/CareersApply'));
const Legal = lazy(() => import('./pages/Legal'));
const PartnerCompetitions = lazy(() => import('./pages/PartnerCompetitions'));
const PartnerPrograms = lazy(() => import('./pages/PartnerPrograms'));
const News = lazy(() => import('./pages/News'));

// Redirect ?code= on non-callback pages to /auth/callback so PKCE exchange runs there
function CodeRedirect({ element }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  if (params.has('code') && location.pathname !== '/auth/callback' && location.pathname !== '/auth/reset-password') {
    return <Navigate to={`/auth/callback${location.search}`} replace />;
  }
  return element;
}

function RouteFallback() {
  return <div className="min-h-screen" aria-busy="true" />;
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<CodeRedirect element={<Home />} />} />
            <Route path="/about" element={<About />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/competitions/quiz-bowl" element={<QuizBowl />} />
            <Route path="/competitions/essay" element={<Essay />} />
            <Route path="/competitions/qualifiers" element={<NationalQualifiers />} />
            <Route path="/competitions/finals" element={<NationalFinals />} />
            <Route path="/competitions/partner-competitions" element={<PartnerCompetitions />} />
            <Route path="/partner-programs" element={<PartnerPrograms />} />
            <Route path="/news" element={<News />} />
            <Route path="/register/quiz-bowl" element={<QuizBowlRegister />} />
            <Route path="/register/essay" element={<EssayRegister />} />
            <Route path="/register/chapter" element={<ChapterRegister />} />
            <Route path="/careers/apply" element={<CareersApply />} />
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
          </Suspense>
        </Router>
        <Toaster />
      </QueryClientProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
