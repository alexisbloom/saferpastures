import React, { useState } from 'react';
import { Menu, X, Truck } from 'lucide-react';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { signOut } = useAuth();

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Truck className="h-6 w-6 text-green-600 mr-2" />
              <h1 className="text-xl font-bold text-green-600">Safer Pastures</h1>
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Transporter</span>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <NotificationBell />
            
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                  <button 
                    onClick={() => signOut()}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700"
                  >
                    Sign out
                  </button>
                </div>
                <div className="ml-3 flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  {user?.profilePicture ? (
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src={user.profilePicture} 
                      alt={user.name} 
                    />
                  ) : (
                    <span className="text-lg font-medium text-gray-700">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <span className="sr-only">Open main menu</span>
              {showMobileMenu ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {showMobileMenu && (
        <div className="sm:hidden">
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                {user?.profilePicture ? (
                  <img 
                    className="h-10 w-10 rounded-full" 
                    src={user.profilePicture} 
                    alt={user.name} 
                  />
                ) : (
                  <span className="text-lg font-medium text-gray-700">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.name || 'User'}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email || user?.phone || ''}</div>
              </div>
              <NotificationBell />
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={() => signOut()}
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;