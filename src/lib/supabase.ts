import { User, Session } from "@supabase/supabase-js";

// VITE_API_URL deve apontar para onde a pasta /api/ está hospedada no HostGator (ex: https://vivenslab.com/api)
const API_URL = import.meta.env.VITE_API_URL || 'https://vivenslab.com/api';

const getHeaders = () => {
    const sessionStr = localStorage.getItem('vivens_session');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (sessionStr) {
        try {
            const session = JSON.parse(sessionStr);
            if (session.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }
        } catch (e) {}
    }
    return headers;
};

// Mock Auth
const auth = {
    async signInWithPassword({ email, password }: any) {
        try {
            const res = await fetch(`${API_URL}/auth.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to login');
            
            localStorage.setItem('vivens_session', JSON.stringify(data.session));
            
            // Trigger listeners (naïve approach for this mock)
            window.dispatchEvent(new Event('authChange'));
            
            return { data, error: null };
        } catch (error: any) {
            return { data: { session: null, user: null }, error };
        }
    },
    async signOut() {
        localStorage.removeItem('vivens_session');
        window.dispatchEvent(new Event('authChange'));
        return { error: null };
    },
    async getSession() {
        const sessionStr = localStorage.getItem('vivens_session');
        if (sessionStr) {
            try {
                return { data: { session: JSON.parse(sessionStr) } };
            } catch (e) {
                return { data: { session: null } };
            }
        }
        return { data: { session: null } };
    },
    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
        // Run immediately once
        this.getSession().then(({ data }) => {
            callback('INITIAL_SESSION', data.session as any);
        });

        const listener = () => {
            this.getSession().then(({ data }) => {
                callback('SIGNED_IN', data.session as any);
            });
        };
        window.addEventListener('authChange', listener);

        return {
            data: {
                subscription: {
                    unsubscribe: () => {
                        window.removeEventListener('authChange', listener);
                    }
                }
            }
        };
    }
};

// Mock Query Builder
class QueryBuilder {
    table: string;
    params: URLSearchParams;
    isSingle: boolean;

    constructor(table: string) {
        this.table = table;
        this.params = new URLSearchParams();
        this.isSingle = false;
    }

    select(cols: string = '*') {
        this.params.append('select', cols);
        return this;
    }

    eq(col: string, val: string | number) {
        this.params.append(`${col}.eq`, val.toString());
        return this;
    }

    single() {
        this.isSingle = true;
        this.params.append('single', 'true');
        return this;
    }

    order(col: string, options: { ascending?: boolean } = {}) {
        this.params.append('order', col);
        if (options.ascending === false) {
            this.params.append('orderDesc', 'true');
        }
        return this;
    }

    // Resolves the GET request automatically if awaited
    then(resolve: (value: any) => void, reject: (reason?: any) => void) {
        const url = `${API_URL}/${this.table}.php?${this.params.toString()}`;
        fetch(url, { headers: getHeaders() })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    resolve({ data: null, error: new Error(data.error) });
                } else {
                    resolve({ data: this.isSingle ? (data[0] || null) : data, error: null });
                }
            })
            .catch(err => resolve({ data: null, error: err }));
    }

    async insert(data: any | any[]) {
        try {
            const res = await fetch(`${API_URL}/${this.table}.php`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (!res.ok || result.error) throw new Error(result.error || 'Insert failed');
            return { data: result, error: null };
        } catch (error: any) {
            return { data: null, error };
        }
    }

    async update(data: any) {
        try {
            const res = await fetch(`${API_URL}/${this.table}.php?${this.params.toString()}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (!res.ok || result.error) throw new Error(result.error || 'Update failed');
            return { data: result, error: null };
        } catch (error: any) {
            return { data: null, error };
        }
    }

    async delete() {
        try {
            const res = await fetch(`${API_URL}/${this.table}.php?${this.params.toString()}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            const result = await res.json();
            if (!res.ok || result.error) throw new Error(result.error || 'Delete failed');
            return { data: result, error: null };
        } catch (error: any) {
            return { data: null, error };
        }
    }
}

// Mock Storage
const storage = {
    from(bucket: string) {
        return {
            async upload(path: string, file: File) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('bucket', bucket);
                    formData.append('path', path);

                    // Upload needs multipart/form-data so we do not pass Content-Type header manually
                    const headers = getHeaders();
                    delete headers['Content-Type'];

                    const res = await fetch(`${API_URL}/upload.php`, {
                        method: 'POST',
                        headers,
                        body: formData
                    });
                    const result = await res.json();
                    if (!res.ok || result.error) throw new Error(result.error || 'Upload failed');
                    return { data: result.data, error: null };
                } catch (error: any) {
                    return { data: null, error };
                }
            },
            getPublicUrl(path: string) {
                return {
                    data: { publicUrl: `${API_URL}/uploads/${bucket}/${path.replace(/^[/]+/, '')}` }
                };
            }
        };
    }
};

// Export the mock client replacing Supabase
export const supabase = {
    auth,
    from: (table: string) => new QueryBuilder(table),
    storage
};
