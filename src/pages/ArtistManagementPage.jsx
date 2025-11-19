import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import './ArtistManagementPage.css';

export default function ArtistManagementPage() {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        fetchArtists();
    }, []);

    const fetchArtists = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('artist_access_codes')
                .select('*')
                .eq('is_admin', false)  // Exclude admin accounts
                .order('created_at', { ascending: false });

            if (error) throw error;
            setArtists(data || []);
        } catch (error) {
            console.error('Error fetching artists:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredArtists = artists.filter(artist => {
        const matchesSearch = artist.artist_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || artist.account_type === filterType;
        return matchesSearch && matchesFilter;
    });

    const handleRevoke = async (id, currentStatus) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'revoke' : 'restore'} this access code?`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('artist_access_codes')
                .update({ is_revoked: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            fetchArtists();
        } catch (error) {
            console.error('Error updating artist:', error);
            alert('Failed to update artist status');
        }
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        alert('Code copied to clipboard!');
    };

    return (
        <div className="artist-management-page">
            <div className="page-header">
                <div>
                    <h1>Artist Management</h1>
                    <p className="text-secondary">Manage artist access codes and accounts</p>
                </div>
                <Link to="/dashboard/artists/create" className="btn btn-primary">
                    Create New Artist
                </Link>
            </div>

            <div className="filters-section card">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search artists..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterType('all')}
                    >
                        All ({artists.length})
                    </button>
                    <button
                        className={`filter-btn ${filterType === 'artist' ? 'active' : ''}`}
                        onClick={() => setFilterType('artist')}
                    >
                        Artists ({artists.filter(a => a.account_type === 'artist').length})
                    </button>
                    <button
                        className={`filter-btn ${filterType === 'contributor' ? 'active' : ''}`}
                        onClick={() => setFilterType('contributor')}
                    >
                        Contributors ({artists.filter(a => a.account_type === 'contributor').length})
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading artists...</div>
            ) : filteredArtists.length === 0 ? (
                <div className="empty-state card">
                    <p>No artists found</p>
                    <Link to="/dashboard/artists/create" className="btn btn-primary">
                        Create First Artist
                    </Link>
                </div>
            ) : (
                <div className="artists-grid">
                    {filteredArtists.map((artist) => (
                        <div key={artist.id} className={`artist-card card ${artist.is_revoked ? 'revoked' : ''}`}>
                            <div className="artist-card-header">
                                <div>
                                    <h3>{artist.artist_name}</h3>
                                    <div className="artist-meta">
                                        <span className={`badge badge-${artist.account_type}`}>
                                            {artist.account_type}
                                        </span>
                                        <span className="badge badge-category">
                                            {artist.content_category || 'music'}
                                        </span>
                                        {artist.is_revoked && (
                                            <span className="badge badge-revoked">Revoked</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="artist-card-body">
                                <div className="code-display">
                                    <label>Access Code</label>
                                    <div className="code-value">
                                        <code>{artist.code}</code>
                                        <button
                                            className="btn-copy"
                                            onClick={() => copyToClipboard(artist.code)}
                                            title="Copy code"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                <div className="artist-info">
                                    <p className="text-muted">
                                        Created: {new Date(artist.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="artist-card-actions">
                                <Link
                                    to={`/dashboard/artists/${artist.id}`}
                                    className="btn btn-secondary btn-sm"
                                >
                                    View Analytics
                                </Link>
                                <button
                                    className={`btn btn-sm ${artist.is_revoked ? 'btn-success' : 'btn-warning'}`}
                                    onClick={() => handleRevoke(artist.id, artist.is_revoked)}
                                >
                                    {artist.is_revoked ? 'Restore' : 'Revoke'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
