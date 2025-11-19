import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import OverviewPage from './pages/OverviewPage';
import ArtistManagementPage from './pages/ArtistManagementPage';
import CreateArtistPage from './pages/CreateArtistPage';
import './index.css';

function App() {
  const { user, loading, isAdmin, login, logout } = useAuth();

  // Apply theme on mount
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'var(--text-primary)'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAdmin) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardLayout user={user} onLogout={logout} />}>
          <Route index element={<OverviewPage />} />
          <Route path="artists" element={<ArtistManagementPage />} />
          <Route path="artists/create" element={<CreateArtistPage />} />
          <Route path="tracks" element={<PlaceholderPage title="All Tracks" />} />
          <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
          <Route path="earnings" element={<PlaceholderPage title="Earnings" />} />
          <Route path="payments" element={<PlaceholderPage title="Payments" />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Placeholder component for unimplemented pages
function PlaceholderPage({ title }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
      <h1>{title}</h1>
      <p className="text-secondary">This page is coming soon...</p>
    </div>
  );
}

export default App;
