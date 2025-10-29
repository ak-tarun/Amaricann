
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from '../types';
import Button from './Button';
import { DEFAULT_INSTITUTE_LOGO } from '../constants';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === UserRole.STUDENT) return '/student/dashboard';
    if (user.role === UserRole.STAFF || user.role === UserRole.SUPER_ADMIN) return '/admin/dashboard';
    return '/';
  };

  const commonNavLinks = (
    <>
      <li><Link to="/" className="block py-2 px-3 text-gray-700 hover:text-blue-600 rounded md:bg-transparent md:p-0">Home</Link></li>
      <li><Link to="/about" className="block py-2 px-3 text-gray-700 hover:text-blue-600 rounded md:bg-transparent md:p-0">About</Link></li>
      <li><Link to="/courses" className="block py-2 px-3 text-gray-700 hover:text-blue-600 rounded md:bg-transparent md:p-0">Courses</Link></li>
      <li><Link to="/timetable-preview" className="block py-2 px-3 text-gray-700 hover:text-blue-600 rounded md:bg-transparent md:p-0">Timetable</Link></li>
      <li><Link to="/contact" className="block py-2 px-3 text-gray-700 hover:text-blue-600 rounded md:bg-transparent md:p-0">Contact</Link></li>
    </>
  );

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={DEFAULT_INSTITUTE_LOGO} className="h-10 w-10 rounded-full" alt="Institute Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900">American Academy Barhi</span>
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Link to={getDashboardLink()} className="text-sm font-medium text-blue-600 hover:underline hidden sm:block">
                Dashboard
              </Link>
              <Button onClick={handleLogout} variant="destructive" size="sm">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium text-sm px-4 py-2 text-center">Login</Link>
              <Button onClick={() => navigate('/signup')} size="sm">
                Sign Up
              </Button>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-sticky"
            aria-expanded={isOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
        </div>
        <div className={`items-center justify-between ${isOpen ? '' : 'hidden'} w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            {commonNavLinks}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
