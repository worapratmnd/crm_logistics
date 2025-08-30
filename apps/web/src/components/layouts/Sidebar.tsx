import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationItem {
  label: string;
  icon?: string;
  href: string;
}

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    { label: 'Dashboard', href: '/' },
    { label: 'ลูกค้า', href: '/customers' }, // Customers
    { label: 'รายการงาน', href: '/jobs' }, // Tasks/Jobs
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo/Brand Area */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">
            Logistics CRM
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 text-left ${
                    isActiveRoute(item.href)
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Area (optional) */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            v1.0.0
          </div>
        </div>
      </div>
    </aside>
  );
};