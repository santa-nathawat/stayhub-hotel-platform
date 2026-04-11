import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-apple-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-apple-blue rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-apple-text">StayHub</span>
            </div>
            <p className="text-sm text-apple-text-secondary leading-relaxed">
              Find your perfect stay. Book hotels worldwide with the best prices and seamless experience.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-apple-text mb-4">Explore</h3>
            <ul className="space-y-3">
              <li><Link to="/search" className="text-sm text-apple-text-secondary hover:text-apple-text transition-colors">Search Hotels</Link></li>
              <li><Link to="/search?city=Bangkok" className="text-sm text-apple-text-secondary hover:text-apple-text transition-colors">Bangkok</Link></li>
              <li><Link to="/search?city=Tokyo" className="text-sm text-apple-text-secondary hover:text-apple-text transition-colors">Tokyo</Link></li>
              <li><Link to="/search?city=Paris" className="text-sm text-apple-text-secondary hover:text-apple-text transition-colors">Paris</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-apple-text mb-4">Company</h3>
            <ul className="space-y-3">
              <li><span className="text-sm text-apple-text-secondary">About Us</span></li>
              <li><span className="text-sm text-apple-text-secondary">Careers</span></li>
              <li><span className="text-sm text-apple-text-secondary">Contact</span></li>
            </ul>
          </div>

          {/* Partner */}
          <div>
            <h3 className="text-sm font-semibold text-apple-text mb-4">Partner With Us</h3>
            <ul className="space-y-3">
              <li><Link to="/register" className="text-sm text-apple-text-secondary hover:text-apple-text transition-colors">List Your Property</Link></li>
              <li><span className="text-sm text-apple-text-secondary">Partner Support</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-apple-border-light">
          <p className="text-xs text-apple-text-secondary text-center">
            &copy; {new Date().getFullYear()} StayHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
