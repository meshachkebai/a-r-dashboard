/**
 * Generate a unique 5-digit access code
 * @returns {Promise<string>} A unique 5-digit code
 */
export async function generateUniqueCode(supabase) {
    let code;
    let exists = true;
    let attempts = 0;
    const maxAttempts = 10;

    while (exists && attempts < maxAttempts) {
        code = Math.floor(10000 + Math.random() * 90000).toString();

        const { data, error } = await supabase
            .from('artist_access_codes')
            .select('code')
            .eq('code', code)
            .single();

        exists = !!data && !error;
        attempts++;
    }

    if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique code after multiple attempts');
    }

    return code;
}
