import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { useAuth } from '../../contexts/AuthContext';

export function MainLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleMenuClick = () => {
    setIsMobileNavOpen(true);
  };

  const handleCloseMobileNav = () => {
    setIsMobileNavOpen(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-default-100">
      {/* Desktop Sidebar - Fixed with margin */}
      <Sidebar />

      {/* Mobile Navigation Overlay */}
      <MobileNav isOpen={isMobileNavOpen} onClose={handleCloseMobileNav} />

      {/* Main Content Area - Offset by sidebar width + margin on desktop */}
      <div className="md:pl-[280px] flex flex-col min-h-screen">
        {/* Header - Sticky */}
        <Header
          user={user}
          onLogout={handleLogout}
          onMenuClick={handleMenuClick}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
