import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Truck, Clock, DollarSign, Settings, User } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-green-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Truck className="h-8 w-8 text-white" />
              <span className="ml-2 text-white text-lg font-semibold">Safer Pastures</span>
            </div>
            <div className="px-4 mt-1">
              <span className="text-xs bg-green-700 text-white px-2 py-0.5 rounded-full">Transporter App</span>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-green-800 space-y-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-green-900 text-white'
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`
                }
              >
                <Home className="mr-3 h-6 w-6" />
                Dashboard
              </NavLink>
              
              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-green-900 text-white'
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`
                }
              >
                <Truck className="mr-3 h-6 w-6" />
                Jobs
              </NavLink>
              
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-green-900 text-white'
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`
                }
              >
                <Clock className="mr-3 h-6 w-6" />
                History
              </NavLink>
              
              <NavLink
                to="/earnings"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-green-900 text-white'
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`
                }
              >
                <DollarSign className="mr-3 h-6 w-6" />
                Earnings
              </NavLink>
              
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-green-900 text-white'
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`
                }
              >
                <User className="mr-3 h-6 w-6" />
                Profile
              </NavLink>
              
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-green-900 text-white'
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`
                }
              >
                <Settings className="mr-3 h-6 w-6" />
                Settings
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;