import React from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};