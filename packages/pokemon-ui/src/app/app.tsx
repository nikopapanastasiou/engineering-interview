import { BrowserRouter, Link, Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/Signup';
import { SearchPage } from './pages/Search';
import { TeamsPage } from './pages/Teams';
import styled from '@emotion/styled';
import { useAuth } from './state/auth';
import { COLORS } from './components/colors';
import { Button } from './components/ui';

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  border-bottom: 2px solid ${COLORS.primary};
  position: sticky;
  top: 0;
  background: ${COLORS.surface};
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Brand = styled(Link)`
  font-weight: 800;
  font-size: 20px;
  color: ${COLORS.accent};
  text-decoration: none;
  transition: color 0.2s;
  &:hover { color: ${COLORS.error}; }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${COLORS.textSecondary};
  font-weight: 600;
  transition: color 0.2s;
  &:hover { color: ${COLORS.textPrimary}; }
`;

const Spacer = styled.div`
  flex: 1;
`;

const UserGreeting = styled.span`
  color: ${COLORS.textSecondary};
  font-size: 14px;
  strong {
    color: ${COLORS.textPrimary};
  }
`;

const LogoutButton = styled(Button)`
  padding: 6px 12px;
  font-size: 14px;
`;

function Nav() {
  const { user, logout } = useAuth();
  return (
    <Header>
      <Brand to="/">PokéTeams</Brand>
      {user && (
        <>
          <NavLink to="/">Search</NavLink>
          <NavLink to="/teams">Teams</NavLink>
        </>
      )}
      <Spacer />
      {!user ? (
        <>
          <NavLink to="/login">Login</NavLink>
          <span>/</span>
          <NavLink to="/signup">Signup</NavLink>
        </>
      ) : (
        <>
          <UserGreeting>Hi, <strong>{user.displayName}</strong></UserGreeting>
          <LogoutButton onClick={logout} variant="secondary">
            Logout
          </LogoutButton>
        </>
      )}
    </Header>
  );
}

export function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Nav />
      <div style={{ padding: 16, background: COLORS.background, minHeight: 'calc(100vh - 57px)' }}>
        <Routes>
          <Route path="/" element={user ? <SearchPage /> : <Navigate to="/login" replace />} />
          <Route path="/teams" element={user ? <TeamsPage /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
