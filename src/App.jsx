import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
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
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/competitions/ieo" element={<IEO />} />
            <Route path="/competitions/qualifiers" element={<NationalQualifiers />} />
            <Route path="/competitions/finals" element={<NationalFinals />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/research" element={<Research />} />
            <Route path="/chapters" element={<Chapters />} />
            <Route path="/team" element={<Team />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

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
