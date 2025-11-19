import './Header.css';

export default function Header({ user, onLogout, onMenuClick, theme, onThemeToggle }) {
    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
                    ☰
                </button>
                <div className="header-title">
                    <h1>A&R Dashboard</h1>
                    <p className="text-secondary">Welcome, {user?.artistName}</p>
                </div>
            </div>

            <div className="header-right">
                <button
                    className="theme-toggle"
                    onClick={onThemeToggle}
                    aria-label="Toggle theme"
                    title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                    {theme === 'light' ? 'Dark' : 'Light'}
                </button>

                <button className="btn btn-secondary logout-btn" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
}
