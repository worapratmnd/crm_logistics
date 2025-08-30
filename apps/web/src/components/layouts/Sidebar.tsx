import React from 'react';

interface NavigationItem {
  label: string;
  icon?: string;
  href?: string;
}

export const Sidebar: React.FC = () => {
  const navigationItems: NavigationItem[] = [
    { label: 'Dashboard' },
    { label: 'ลูกค้า' }, // Customers
    { label: 'รายการงาน' }, // Tasks/Jobs
  ];

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
                <div className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 cursor-not-allowed transition-colors duration-200">
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                </div>
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