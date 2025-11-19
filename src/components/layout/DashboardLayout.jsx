import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from '../ThemeToggle';
import './DashboardLayout.css';

export default function DashboardLayout({ user, onLogout }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <div className="header-left">
                    <button className="hamburger-menu" onClick={toggleSidebar} aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <div className="header-branding">
                        <h1 className="brand-name">pairap</h1>
                        <span className="brand-subtitle">A&R Dashboard</span>
                    </div>
                </div>

                <div className="header-right">
                    <ThemeToggle />
                    <div className="user-info">
                        <div className="user-role">Admin</div>
                        <div className="user-name">{user?.artistName}</div>
                    </div>
                    <button onClick={onLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </header>

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="dashboard-main">
                <Outlet />
            </main>
        </div>
    );
}
