import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { getInitials } from '../../lib/utils';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-apple-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-apple-blue rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-apple-text">StayHub</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/search" className="text-sm text-apple-text-secondary hover:text-apple-text transition-colors">
              Explore
            </Link>
            {user && (
              <Link to="/bookings" className="text-sm text-apple-text-secondary hover:text-apple-text transition-colors">
                My Bookings
              </Link>
            )}
            {user?.role === 'PARTNER' && (
              <Link to="/partner/dashboard" className="text-sm text-apple-text-secondary hover:text-apple-text transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-apple-blue/10 text-apple-blue rounded-full flex items-center justify-center text-sm font-medium">
                    {getInitials(user.name)}
                  </div>
                  <span className="text-sm font-medium text-apple-text">{user.name}</span>
                  <svg className="w-4 h-4 text-apple-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-modal border border-apple-border py-2 z-50">
                      <div className="px-4 py-2 border-b border-apple-border-light">
                        <p className="text-sm font-medium text-apple-text">{user.name}</p>
                        <p className="text-xs text-apple-text-secondary">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-apple-text hover:bg-gray-50"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/bookings"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-apple-text hover:bg-gray-50"
                      >
                        My Bookings
                      </Link>
                      {user.role === 'PARTNER' && (
                        <Link
                          to="/partner/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-apple-text hover:bg-gray-50"
                        >
                          Partner Dashboard
                        </Link>
                      )}
                      <hr className="my-1 border-apple-border-light" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-apple-error hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-50"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6 text-apple-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-apple-border-light py-4 space-y-2">
            <Link to="/search" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-50">
              Explore
            </Link>
            {user && (
              <>
                <Link to="/bookings" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-50">
                  My Bookings
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-50">
                  Profile
                </Link>
                {user.role === 'PARTNER' && (
                  <Link to="/partner/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-50">
                    Partner Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-apple-error rounded-lg hover:bg-red-50">
                  Sign Out
                </button>
              </>
            )}
            {!user && (
              <div className="flex gap-2 px-3 pt-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => { navigate('/login'); setMobileOpen(false); }}>
                  Sign In
                </Button>
                <Button size="sm" className="flex-1" onClick={() => { navigate('/register'); setMobileOpen(false); }}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
