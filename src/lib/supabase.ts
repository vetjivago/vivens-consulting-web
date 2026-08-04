import { User, Session } from "@supabase/supabase-js";

// VITE_API_URL deve apontar para onde a pasta /api/ está hospedada no HostGator
const API_URL = import.meta.env.VITE_API_URL || 'https://mail.vivenslab.com/api';

const getHeaders = () => {
    const sessionStr = localStorage.getItem('vivens_session');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    };
    if (sessionStr) {
        try {
            const session = JSON.parse(sessionStr);
            if (session.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }
        } catch (e) {
            // Ignore invalid JSON in localStorage
        }
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

// LocalStorage Persistence Helpers
const getLocalData = (table: string): any[] => {
    try {
        const item = localStorage.getItem(`vivens_db_${table}`);
        return item ? JSON.parse(item) : [];
    } catch {
        return [];
    }
};

const setLocalData = (table: string, data: any[]) => {
    try {
        localStorage.setItem(`vivens_db_${table}`, JSON.stringify(data));
    } catch {
        // Ignore storage full or quota errors
    }
};

const getCorePayload = (table: string, item: any) => {
    const id = item.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2));
    const created_at = item.created_at || new Date().toISOString();

    if (table === 'clients') {
        const fullAddr = item.address || `${item.street || ''}, ${item.number || ''} - ${item.neighborhood || ''}, ${item.city || ''}/${item.state || ''}`.replace(/^[\s,-/]+|[\s,-/]+$/g, '');
        return {
            id,
            name: item.name || item.fantasy_name || 'Novo Cliente',
            document: item.document || '',
            email: item.email || '',
            phone: item.phone || '',
            address: fullAddr,
            status: item.status || 'active',
            created_at
        };
    }
    if (table === 'projects') {
        return {
            id,
            title: item.title || 'Novo Projeto',
            client_id: item.client_id || null,
            status: item.status || 'active',
            start_date: item.start_date || null,
            end_date: item.end_date || null,
            description: item.description || '',
            created_at
        };
    }
    if (table === 'reports') {
        return {
            id,
            title: item.title || 'Novo Relatório',
            project_id: item.project_id || null,
            type: item.type || 'relatorio',
            status: item.status || 'draft',
            content: typeof item.content === 'object' ? JSON.stringify(item.content) : (item.content || ''),
            created_at
        };
    }
    return { id, created_at, ...item };
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
            .then(async res => {
                if (res.status === 401) {
                    localStorage.removeItem('vivens_session');
                    window.dispatchEvent(new Event('authChange'));
                }
                const data = await res.json();
                if (!res.ok || data.error || !Array.isArray(data)) {
                    throw new Error(data?.error || `HTTP ${res.status}`);
                } else {
                    const local = getLocalData(this.table);
                    const serverIds = new Set(data.map((d: any) => d.id));
                    const localOnly = local.filter((l: any) => !serverIds.has(l.id));
                    const merged = [...data, ...localOnly];
                    setLocalData(this.table, merged);
                    resolve({ data: this.isSingle ? (merged[0] || null) : merged, error: null });
                }
            })
            .catch(() => {
                let local = getLocalData(this.table);
                const eqCol = Array.from(this.params.entries()).find(([k]) => k.endsWith('.eq'));
                if (eqCol) {
                    const [k, val] = eqCol;
                    const colName = k.replace('.eq', '');
                    local = local.filter((item: any) => String(item[colName]) === String(val));
                }
                resolve({ data: this.isSingle ? (local[0] || null) : local, error: null });
            });
    }

    async insert(data: any | any[]) {
        const items = Array.isArray(data) ? data : [data];
        const local = getLocalData(this.table);

        const preparedItems = items.map(item => getCorePayload(this.table, item));
        const updatedLocal = [...preparedItems, ...local];
        setLocalData(this.table, updatedLocal);

        // 1. Try sending full payload
        try {
            const res = await fetch(`${API_URL}/${this.table}.php`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            if (res.status === 401) {
                localStorage.removeItem('vivens_session');
                window.dispatchEvent(new Event('authChange'));
            }
            const result = await res.json();
            if (res.ok && Array.isArray(result) && result.length > 0) {
                return { data: result, error: null };
            }
        } catch (error: any) {
            // Silently retry
        }

        // 2. Retry with sanitized core payload matching exact MySQL table columns
        try {
            const res = await fetch(`${API_URL}/${this.table}.php`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(preparedItems)
            });
            const result = await res.json();
            if (res.ok && Array.isArray(result) && result.length > 0) {
                return { data: result, error: null };
            }
        } catch (error: any) {}

        return { data: preparedItems, error: null };
    }

    async update(data: any) {
        const eqParam = Array.from(this.params.entries()).find(([k]) => k.endsWith('.eq'));
        const targetId = eqParam ? eqParam[1] : (data.id || null);

        if (targetId) {
            const local = getLocalData(this.table);
            const updated = local.map(item => item.id === targetId ? { ...item, ...data } : item);
            setLocalData(this.table, updated);
        }

        try {
            const res = await fetch(`${API_URL}/${this.table}.php?${this.params.toString()}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            if (res.status === 401) {
                localStorage.removeItem('vivens_session');
                window.dispatchEvent(new Event('authChange'));
            }
            const result = await res.json();
            if (res.ok && !result.error) {
                return { data: result, error: null };
            }
        } catch (error: any) {}

        const local = getLocalData(this.table);
        const item = local.find(i => i.id === targetId) || data;
        return { data: [item], error: null };
    }

    async delete() {
        const eqParam = Array.from(this.params.entries()).find(([k]) => k.endsWith('.eq'));
        const targetId = eqParam ? eqParam[1] : null;

        if (targetId) {
            const local = getLocalData(this.table);
            const filtered = local.filter(item => item.id !== targetId);
            setLocalData(this.table, filtered);
        }

        try {
            const res = await fetch(`${API_URL}/${this.table}.php?${this.params.toString()}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (res.status === 401) {
                localStorage.removeItem('vivens_session');
                window.dispatchEvent(new Event('authChange'));
            }
        } catch (error: any) {}

        return { data: { success: true }, error: null };
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
