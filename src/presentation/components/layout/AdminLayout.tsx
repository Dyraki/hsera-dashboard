import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex bg-gray-50 text-gray-700 font-sans overflow-hidden">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Reusable Sidebar Component */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Reusable Header Component */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Dynamic Inner Page Content */}
        <main className="flex-1 overflow-y-auto min-h-0 p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
