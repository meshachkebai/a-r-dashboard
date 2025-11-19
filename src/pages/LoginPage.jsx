import { useState } from 'react';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
    const [artistName, setArtistName] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await onLogin(artistName, code);

        if (!result.success) {
            setError(result.error || 'Invalid admin credentials');
        }

        setLoading(false);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>A&R Admin Dashboard</h1>
                    <p>Artist & Repertoire Management</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="artistName">Admin Name</label>
                        <input
                            id="artistName"
                            type="text"
                            value={artistName}
                            onChange={(e) => setArtistName(e.target.value)}
                            placeholder="Enter your admin name"
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="code">Access Code</label>
                        <input
                            id="code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="5-digit code"
                            maxLength="5"
                            pattern="[0-9]{5}"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="login-footer">
                    <p className="text-muted">
                        Admin access only • Secure authentication
                    </p>
                </div>
            </div>
        </div>
    );
}
