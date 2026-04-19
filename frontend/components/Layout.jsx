/**
 * Layout Component
 * Location: frontend/components/Layout.jsx
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, LogOut } from 'lucide-react';
import FloatingAvatar from './FloatingAvatar/FloatingAvatar';

const Layout = ({ children }) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Medicines', href: '/medicines' },
    { label: 'Appointments', href: '/appointments' },
    { label: 'Health Metrics', href: '/health-metrics' },
    { label: 'Profile', href: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-healthcare sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-healthcare-400 to-healthcare-600 rounded-lg flex items-center justify-center text-white font-bold">
                💊
              </div>
              <span className="text-xl font-bold text-gray-800 hidden sm:inline">
                HealthAI
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    router.pathname === item.href
                      ? 'text-healthcare-600 border-b-2 border-healthcare-600 pb-4'
                      : 'text-gray-600 hover:text-healthcare-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-healthcare-600 font-medium transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-2 py-2 text-sm text-gray-600 hover:text-healthcare-600 hover:bg-healthcare-50 rounded"
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-2 py-2 text-sm text-gray-600 hover:text-healthcare-600 hover:bg-healthcare-50 rounded mt-4"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Floating Avatar */}
      <FloatingAvatar />

      {/* Medical Disclaimer Footer */}
      <footer className="bg-yellow-50 border-t-4 border-yellow-300 mt-12 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <span className="text-yellow-600 text-xl">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-yellow-800">
                Medical Disclaimer
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                This AI health assistant does not replace professional medical advice. 
                Always consult with qualified healthcare professionals for diagnosis, 
                treatment, or medical advice. In case of emergency, call your local 
                emergency number or visit the nearest hospital.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
