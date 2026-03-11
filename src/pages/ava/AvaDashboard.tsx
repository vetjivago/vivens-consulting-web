import { useState, useEffect } from "react";
import { Book, LayoutDashboard, Award, Settings, Search, LogOut, User, ChevronRight, Clock, TrendingUp, GraduationCap, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || 'https://mail.vivenslab.com/api';

const getSession = () => {
  try {
    const s = localStorage.getItem('vivens_session');
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};

export const AvaDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const session = getSession();
    if (session?.user?.email) setUserEmail(session.user.email);

    // Fetch profile name
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;

    fetch(`${API_URL}/ava/profile.php`, { headers })
      .then(r => r.json())
      .then(d => { if (d.success && d.user?.name) setUserName(d.user.name); })
      .catch(() => {});

    fetch(`${API_URL}/ava/courses.php`, { headers })
      .then(res => res.json())
      .then(data => {
        if (data.success) setCourses(data.courses);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayName = userName || userEmail?.split('@')[0] || 'Aluno';
  const initials = userName
    ? userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : displayName.slice(0, 2).toUpperCase();

  const totalCourses = courses.length;
  const completedLessons = courses.reduce((acc, c) => acc + (c.completed_lessons || 0), 0);
  const totalLessons = courses.reduce((acc, c) => acc + (c.total_lessons || 0), 0);
  const avgProgress = totalCourses > 0 ? Math.round(courses.reduce((acc, c) => acc + (c.progress_percent || 0), 0) / totalCourses) : 0;

  const handleLogout = () => {
    localStorage.removeItem('vivens_session');
    toast.success('Logout realizado com sucesso');
    navigate('/ava/login');
  };

  return (
    <div className="flex h-screen w-full bg-[#f0f4f8] font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-[#1E4658] to-[#15333f] flex flex-col hidden md:flex shadow-xl">
        <div className="p-6 pb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Vivens AVA</h1>
          <p className="text-[#5BB2A1]/80 text-xs mt-1">Ambiente Virtual de Aprendizagem</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-white bg-white/10 rounded-xl font-medium backdrop-blur-sm">
            <LayoutDashboard size={20} />
            Início
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all duration-200">
            <Book size={20} />
            Meus Cursos
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all duration-200">
            <Award size={20} />
            Certificados
          </a>
          <Link to="/ava/configuracoes" className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all duration-200">
            <Settings size={20} />
            Configurações
          </Link>
        </nav>

        <div className="p-4 mx-4 mb-4 bg-white/5 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5BB2A1] flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{displayName}</p>
              <p className="text-xs text-white/50 truncate">{userEmail}</p>
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
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar cursos..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 border-none outline-none focus:ring-2 focus:ring-[#5BB2A1] transition-all" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-[#5BB2A1] flex items-center justify-center text-white font-bold text-xs shadow-md">
              {initials}
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto">
          {/* Hero Banner */}
          <div className="mx-8 mt-6 bg-gradient-to-r from-[#1E4658] to-[#2a6b82] rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5BB2A1]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-[#5BB2A1]/10 rounded-full blur-2xl translate-y-1/2" />
            <div className="relative z-10">
              <p className="text-[#5BB2A1] font-medium mb-1 text-sm">👋 Olá, {displayName}!</p>
              <h1 className="text-3xl font-bold mb-2">Bem-vindo ao seu painel</h1>
              <p className="text-white/70 max-w-lg">Continue de onde parou e alcance seus objetivos. Acompanhe seu progresso e explore novos conteúdos.</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-8 mt-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#5BB2A1]/10 flex items-center justify-center">
                <GraduationCap className="text-[#5BB2A1]" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1E4658]">{totalCourses}</p>
                <p className="text-xs text-slate-500">Cursos disponíveis</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <BookOpen className="text-blue-500" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1E4658]">{completedLessons}/{totalLessons}</p>
                <p className="text-xs text-slate-500">Aulas concluídas</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <TrendingUp className="text-amber-500" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1E4658]">{avgProgress}%</p>
                <p className="text-xs text-slate-500">Progresso geral</p>
              </div>
            </div>
          </div>

          <div className="px-8 pb-12 mt-8">
            {/* Active Courses */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#1E4658]">Seus Cursos</h2>
              <span className="text-sm text-slate-500">{totalCourses} curso(s)</span>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-[#5BB2A1]/30 border-t-[#5BB2A1] rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {courses.map(course => (
                  <Link to={`/ava/curso/${course.id}`} key={course.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block">
                    <div className="h-40 bg-gradient-to-br from-[#1E4658] to-[#2a6b82] relative overflow-hidden">
                      <div className="absolute inset-0 opacity-30 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${course.thumbnail_url})`}} />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                          {course.total_lessons || 0} aulas
                        </span>
                        <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium flex items-center gap-1">
                          <Clock size={12} /> 2h por módulo
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[#1E4658] mb-1 group-hover:text-[#5BB2A1] transition-colors">{course.title}</h3>
                      <p className="text-sm text-slate-400 mb-4 flex items-center gap-1.5">
                        <User size={14} /> {course.instructor}
                      </p>
                      <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                        <div className="bg-gradient-to-r from-[#5BB2A1] to-[#3d9a8a] h-2 rounded-full transition-all duration-700" style={{ width: `${course.progress_percent || 0}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-500">
                          {course.progress_percent || 0}% concluído
                        </span>
                        <span className="text-xs font-semibold text-[#5BB2A1] flex items-center gap-1 group-hover:gap-2 transition-all">
                          Continuar <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Quick Tips Section */}
            <h2 className="text-xl font-bold text-[#1E4658] mb-5">Dicas Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#5BB2A1]/5 to-[#5BB2A1]/10 rounded-2xl p-6 border border-[#5BB2A1]/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#5BB2A1]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E4658] mb-1">Estude no seu ritmo</h3>
                    <p className="text-sm text-slate-600">As aulas ficam disponíveis por 12 meses. Assista, revise e pratique quantas vezes quiser.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📜</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E4658] mb-1">Certificado com chancela SBCAL</h3>
                    <p className="text-sm text-slate-600">Ao concluir, receba seu certificado digital emitido pela Vivens com chancela da SBCAL.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
