import { useState, useEffect } from "react";
import { ChevronLeft, PlayCircle, CheckCircle, Clock, ChevronDown, ChevronUp, BookOpen, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'https://mail.vivenslab.com/api';

const getSession = () => {
  try {
    const s = localStorage.getItem('vivens_session');
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};

export const AvaCoursePlayer = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const session = getSession();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;

    fetch(`${API_URL}/ava/modules.php?course_id=${id}`, { headers })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setCourse(data.course);
          setModules(data.modules || []);
          // Expand first module by default
          if (data.modules?.length > 0) {
            setExpandedModules({ [data.modules[0].id]: true });
            // Set first lesson as active
            if (data.modules[0].lessons?.length > 0) {
              setActiveLesson(data.modules[0].lessons[0]);
            }
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const completedCount = modules.reduce((acc, m) => acc + (m.lessons?.filter((l: any) => l.is_completed)?.length || 0), 0);
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f0f4f8]">
        <div className="w-10 h-10 border-4 border-[#5BB2A1]/30 border-t-[#5BB2A1] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#f0f4f8] font-sans">
      {/* Top Navbar */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/ava/dashboard" className="text-slate-500 hover:text-[#1E4658] transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#1E4658] leading-tight">{course?.title || 'Curso'}</h1>
            <p className="text-xs text-slate-500">{course?.instructor || 'Equipe Vivens'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">{progressPercent}%</span>
          <div className="w-32 bg-slate-100 rounded-full h-2">
            <div className="bg-gradient-to-r from-[#5BB2A1] to-[#3d9a8a] h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-auto">
          {/* Video/Content Player */}
          <div className="w-full bg-gradient-to-br from-[#1E4658] to-[#2a6b82] aspect-video max-h-[420px] flex items-center justify-center relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5BB2A1]/10 rounded-full blur-3xl" />
            <div className="text-center relative z-10">
              <PlayCircle size={72} className="text-white/80 cursor-pointer hover:text-white hover:scale-110 transition-all duration-300 mx-auto mb-4" />
              <p className="text-white font-semibold text-lg">{activeLesson?.title || 'Selecione uma aula'}</p>
              {activeLesson && (
                <p className="text-white/50 text-sm mt-2 flex items-center justify-center gap-2">
                  <Clock size={14} /> {activeLesson.duration_minutes} min
                </p>
              )}
            </div>
          </div>

          {/* Lesson Details & Tabs */}
          <div className="p-8 pb-16">
            <h2 className="text-2xl font-bold text-[#1E4658] mb-2">{activeLesson?.title || 'Selecione uma aula'}</h2>
            {activeLesson?.content_text && (
              <p className="text-slate-500 text-sm mb-6">{activeLesson.content_text}</p>
            )}
            
            <div className="flex border-b border-slate-200 mb-6">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-medium transition-colors ${activeTab === 'overview' ? 'text-[#5BB2A1] border-b-2 border-[#5BB2A1]' : 'text-slate-500 hover:text-[#1E4658]'}`}
              >
                Visão Geral
              </button>
              <button 
                onClick={() => setActiveTab('resources')}
                className={`px-6 py-3 font-medium transition-colors ${activeTab === 'resources' ? 'text-[#5BB2A1] border-b-2 border-[#5BB2A1]' : 'text-slate-500 hover:text-[#1E4658]'}`}
              >
                Recursos
              </button>
              <button 
                onClick={() => setActiveTab('discussion')}
                className={`px-6 py-3 font-medium transition-colors ${activeTab === 'discussion' ? 'text-[#5BB2A1] border-b-2 border-[#5BB2A1]' : 'text-slate-500 hover:text-[#1E4658]'}`}
              >
                Discussão
              </button>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#5BB2A1]/10 flex items-center justify-center">
                        <BookOpen className="text-[#5BB2A1]" size={20} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-[#1E4658]">{totalLessons}</p>
                        <p className="text-xs text-slate-500">Total de aulas</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Clock className="text-blue-500" size={20} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-[#1E4658]">22h</p>
                        <p className="text-xs text-slate-500">Carga horária</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                        <Users className="text-amber-500" size={20} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-[#1E4658]">Equipe Vivens</p>
                        <p className="text-xs text-slate-500">Instrutores</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-[#1E4658] mb-3">Sobre este curso</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{course?.description || 'Descrição não disponível.'}</p>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <p className="text-slate-500 text-sm">Os materiais didáticos serão disponibilizados ao longo das aulas.</p>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <p className="text-slate-500 text-sm">Fórum de discussão - em breve.</p>
              </div>
            )}
          </div>
        </main>

        {/* Sidebar Curriculum */}
        <aside className="w-80 bg-white overflow-hidden flex flex-col shrink-0 border-l border-slate-200/50 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-[#1E4658] mb-1">Conteúdo do Curso</h3>
            <p className="text-xs text-slate-500">{modules.length} módulos • {totalLessons} aulas • {completedCount} concluídas</p>
          </div>
          
          <div className="flex-1 overflow-auto">
            {modules.map((module, modIdx) => (
              <div key={module.id} className="border-b border-slate-100">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#1E4658] text-sm truncate">{module.title}</h4>
                    <span className="text-xs text-slate-400">{module.lessons?.length || 0} aula(s)</span>
                  </div>
                  {expandedModules[module.id] ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
                </button>

                {expandedModules[module.id] && module.lessons && (
                  <div className="pb-2">
                    {module.lessons.map((lesson: any) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full flex items-start gap-3 p-3 px-5 text-left transition-colors ${
                          activeLesson?.id === lesson.id 
                            ? 'bg-[#5BB2A1]/10 border-l-2 border-[#5BB2A1]' 
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <CheckCircle size={16} className={`mt-0.5 shrink-0 ${lesson.is_completed ? 'text-[#5BB2A1]' : 'text-slate-300'}`} />
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-medium block truncate ${activeLesson?.id === lesson.id ? 'text-[#1E4658]' : 'text-slate-600'}`}>
                            {lesson.title}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock size={11} /> {lesson.duration_minutes} min
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
