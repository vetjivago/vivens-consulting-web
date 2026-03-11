import { useState, useEffect } from "react";
import { Book, LayoutDashboard, Award, Settings, ArrowLeft, Save, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || 'https://mail.vivenslab.com/api';

const getSession = () => {
  try {
    const s = localStorage.getItem('vivens_session');
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};

export const AvaSettings = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session?.user?.email) setEmail(session.user.email);

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;

    fetch(`${API_URL}/ava/profile.php`, { headers })
      .then(r => r.json())
      .then(d => {
        if (d.success && d.user) {
          if (d.user.name) setName(d.user.name);
          if (d.user.email) setEmail(d.user.email);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const session = getSession();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;

    try {
      const res = await fetch(`${API_URL}/ava/profile.php`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Perfil atualizado com sucesso!');
      } else {
        toast.error(data.error || 'Erro ao salvar');
      }
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vivens_session');
    toast.success('Logout realizado com sucesso');
    navigate('/ava/login');
  };

  const displayName = name || email?.split('@')[0] || 'Aluno';
  const initials = name
    ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : displayName.slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen w-full bg-[#f0f4f8] font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-[#1E4658] to-[#15333f] flex flex-col hidden md:flex shadow-xl">
        <div className="p-6 pb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Vivens AVA</h1>
          <p className="text-[#5BB2A1]/80 text-xs mt-1">Ambiente Virtual de Aprendizagem</p>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-2">
          <Link to="/ava/dashboard" className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all duration-200">
            <LayoutDashboard size={20} />
            Início
          </Link>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all duration-200">
            <Book size={20} />
            Meus Cursos
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all duration-200">
            <Award size={20} />
            Certificados
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-white bg-white/10 rounded-xl font-medium backdrop-blur-sm">
            <Settings size={20} />
            Configurações
          </a>
        </nav>
        <div className="p-4 mx-4 mb-4 bg-white/5 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5BB2A1] flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{displayName}</p>
              <p className="text-xs text-white/50 truncate">{email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-3 flex items-center gap-2 text-xs text-white/50 hover:text-red-300 transition-colors w-full">
            <LogOut size={14} />
            Sair da plataforma
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center px-8 sticky top-0 z-10">
          <Link to="/ava/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-[#1E4658] transition-colors mr-4">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-lg font-semibold text-[#1E4658]">Configurações</h2>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-2xl mx-auto">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#1E4658] to-[#2a6b82] p-8 text-center relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#5BB2A1]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-full bg-[#5BB2A1] flex items-center justify-center text-white font-bold text-2xl shadow-xl mx-auto mb-3">
                    {initials}
                  </div>
                  <h3 className="text-white font-bold text-xl">{displayName}</h3>
                  <p className="text-white/60 text-sm">{email}</p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <h3 className="text-lg font-bold text-[#1E4658] flex items-center gap-2">
                  <User size={20} />
                  Dados Pessoais
                </h3>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-[#5BB2A1]/30 border-t-[#5BB2A1] rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome completo</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Digite seu nome completo"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#5BB2A1] focus:border-[#5BB2A1] outline-none transition-all text-[#1E4658]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 outline-none cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-400 mt-1">O e-mail não pode ser alterado.</p>
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-[#5BB2A1] hover:bg-[#4a9787] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 shadow-md hover:shadow-lg"
                    >
                      <Save size={18} />
                      {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
