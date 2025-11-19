import './OverviewPage.css';

export default function OverviewPage() {
    return (
        <div className="overview-page">
            <div className="page-header">
                <h1>Platform Overview</h1>
                <p className="text-secondary">A&R Dashboard - Artist & Repertoire Management</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card card">
                    <div className="stat-content">
                        <h3>Total Artists</h3>
                        <p className="stat-value">Coming Soon</p>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-content">
                        <h3>Total Tracks</h3>
                        <p className="stat-value">Coming Soon</p>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-content">
                        <h3>Total Streams</h3>
                        <p className="stat-value">Coming Soon</p>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-content">
                        <h3>Total Earnings</h3>
                        <p className="stat-value">Coming Soon</p>
                    </div>
                </div>
            </div>

            <div className="welcome-card card">
                <h2>Welcome to the A&R Admin Dashboard</h2>
                <p>
                    This is your central hub for managing artists and their content. Use the sidebar to navigate between different sections:
                </p>
                <ul>
                    <li><strong>Artists</strong> - Manage artist access codes and view their analytics</li>
                    <li><strong>All Tracks</strong> - View and manage all tracks across the platform</li>
                    <li><strong>Analytics</strong> - Platform-wide analytics and insights</li>
                    <li><strong>Earnings</strong> - Track revenue and artist payouts</li>
                    <li><strong>Payments</strong> - Manage payment processing</li>
                </ul>
            </div>
        </div>
    );
}
