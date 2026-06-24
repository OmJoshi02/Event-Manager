import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Navbar onMenuToggle={() => setSidebarOpen((o) => !o)} />
      <div className="with-sidebar">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="sidebar-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
