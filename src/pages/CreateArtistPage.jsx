import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { generateUniqueCode } from '../services/codeGenerator';
import './CreateArtistPage.css';

export default function CreateArtistPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        artistName: '',
        accountType: 'artist',
        contentCategory: 'music',
        code: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateCode = async () => {
        try {
            const code = await generateUniqueCode(supabase);
            setFormData(prev => ({ ...prev, code }));
        } catch (err) {
            setError('Failed to generate code. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate code
            if (!formData.code || formData.code.length !== 5) {
                throw new Error('Please generate a 5-digit code');
            }

            // Create artist access code
            const { data, error: insertError } = await supabase
                .from('artist_access_codes')
                .insert({
                    artist_name: formData.artistName,
                    code: formData.code,
                    account_type: formData.accountType,
                    content_category: formData.contentCategory,
                    is_admin: false,
                    is_revoked: false
                })
                .select()
                .single();

            if (insertError) throw insertError;

            alert(`Artist created successfully!\nAccess Code: ${formData.code}`);
            navigate('/dashboard/artists');
        } catch (err) {
            setError(err.message || 'Failed to create artist');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-artist-page">
            <div className="page-header">
                <div>
                    <h1>Create New Artist</h1>
                    <p className="text-secondary">Generate access code for a new artist account</p>
                </div>
            </div>

            <div className="create-artist-form-container card">
                <form onSubmit={handleSubmit} className="create-artist-form">
                    <div className="form-group">
                        <label htmlFor="artistName">Artist Name *</label>
                        <input
                            id="artistName"
                            type="text"
                            value={formData.artistName}
                            onChange={(e) => setFormData(prev => ({ ...prev, artistName: e.target.value }))}
                            placeholder="Enter artist name"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="accountType">Account Type *</label>
                            <select
                                id="accountType"
                                value={formData.accountType}
                                onChange={(e) => setFormData(prev => ({ ...prev, accountType: e.target.value }))}
                                required
                            >
                                <option value="artist">Artist (Can Upload)</option>
                                <option value="contributor">Contributor (View Only)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="contentCategory">Content Category *</label>
                            <select
                                id="contentCategory"
                                value={formData.contentCategory}
                                onChange={(e) => setFormData(prev => ({ ...prev, contentCategory: e.target.value }))}
                                required
                            >
                                <option value="music">Music</option>
                                <option value="gospel">Gospel</option>
                                <option value="podcast">Podcast</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="code">Access Code *</label>
                        <div className="code-input-group">
                            <input
                                id="code"
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                placeholder="Generate or enter 5-digit code"
                                maxLength="5"
                                pattern="[0-9]{5}"
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleGenerateCode}
                            >
                                Generate Code
                            </button>
                        </div>
                        <small className="text-muted">5-digit numeric code for artist login</small>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/dashboard/artists')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Artist'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
