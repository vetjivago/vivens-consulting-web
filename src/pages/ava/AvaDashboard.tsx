import { Book, LayoutDashboard, Award, Settings, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'https://labscienceacademy.com/api';

export const AvaDashboard = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/ava/courses.php`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCourses(data.courses);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#1E4658]">Vivens VLE</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#5BB2A1] bg-[#5BB2A1]/10 rounded-lg font-medium">
            <LayoutDashboard size={20} />
            Início
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-[#1E4658] hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <Book size={20} />
            Meus Cursos
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-[#1E4658] hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <Award size={20} />
            Certificados
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-[#1E4658] hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <Settings size={20} />
            Configurações
          </a>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-[#1E4658] font-bold">JD</div>
            <div>
              <p className="text-sm font-semibold text-[#1E4658]">João Silva</p>
              <p className="text-xs text-slate-500">Aluno</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar cursos..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 border-none outline-none focus:ring-2 focus:ring-[#5BB2A1]" />
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-[#1E4658] mb-2">Bem-vindo de volta, João!</h1>
            <p className="text-slate-600 mb-8">Continue de onde parou e alcance seus objetivos.</p>

            {/* Active Courses */}
            <h2 className="text-xl font-bold text-[#1E4658] mb-4">Cursos em Andamento / Disponíveis</h2>
            {loading ? (
               <p className="text-slate-500">Carregando cursos...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {courses.map(course => (
                  <Link to={`/ava/curso/${course.id}`} key={course.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
                    <div className="h-32 bg-[#1E4658] relative">
                      <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${course.thumbnail_url})`}} />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[#1E4658] mb-1">{course.title}</h3>
                      <p className="text-sm text-slate-500 mb-4">{course.instructor}</p>
                      <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                        <div className="bg-[#5BB2A1] h-2 rounded-full" style={{ width: `${course.progress_percent || 0}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs font-medium text-slate-500">
                        <span>{course.progress_percent || 0}% Concluído ({course.completed_lessons || 0}/{course.total_lessons || 0})</span>
                        <span className="text-[#5BB2A1]">Acessar</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Recommended Courses */}
            <h2 className="text-xl font-bold text-[#1E4658] mb-4">Mural de Cursos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm group cursor-pointer">
                <div className="h-40 bg-slate-200 relative group-hover:scale-105 transition-transform duration-300">
                  <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop" alt="Course" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#1E4658] text-sm mb-2">Introdução aos 3Rs</h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">Fundamentos da substituição, redução e refinamento.</p>
                  <button className="w-full py-2 bg-slate-100 text-[#1E4658] font-medium text-sm rounded-lg group-hover:bg-[#5BB2A1] group-hover:text-white transition-colors">Saiba Mais</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
