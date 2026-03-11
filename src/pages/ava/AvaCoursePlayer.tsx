import { ChevronLeft, PlayCircle, CheckCircle, FileText, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export const AvaCoursePlayer = () => {
  return (
    <div className="flex flex-col h-screen w-full bg-[#f8fafc] font-sans">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/ava/dashboard" className="text-slate-500 hover:text-[#1E4658] transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-lg font-bold text-[#1E4658]">Ciência de Animais de Laboratório</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-500">Seu progresso: 75%</span>
          <div className="w-32 bg-slate-100 rounded-full h-2">
            <div className="bg-[#5BB2A1] h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-auto border-r border-slate-200">
          {/* Video Player */}
          <div className="w-full bg-black aspect-video flex items-center justify-center relative">
            {/* Placeholder for actual video element */}
            <div className="absolute inset-0 bg-[#1E4658]/80 flex items-center justify-center flex-col">
              <PlayCircle size={64} className="text-white opacity-80 cursor-pointer hover:opacity-100 transition-opacity mb-4" />
              <p className="text-white font-medium">1.1 Introdução à Ética Animal</p>
            </div>
          </div>

          {/* Video Details & Tabs */}
          <div className="p-8 pb-32">
            <h2 className="text-2xl font-bold text-[#1E4658] mb-6">1.1 Introdução à Ética Animal</h2>
            
            <div className="flex border-b border-slate-200 mb-6">
              <button className="px-6 py-3 font-medium text-[#5BB2A1] border-b-2 border-[#5BB2A1]">Visão Geral</button>
              <button className="px-6 py-3 font-medium text-slate-500 hover:text-[#1E4658]">Recursos <span className="ml-1 bg-slate-100 text-slate-600 text-xs py-0.5 px-2 rounded-full">2</span></button>
              <button className="px-6 py-3 font-medium text-slate-500 hover:text-[#1E4658]">Discussão</button>
            </div>

            <div className="prose max-w-none text-slate-600">
              <p className="mb-4">Nesta aula introdutória, abordaremos os conceitos fundamentais sobre ética e uso de animais na ciência, discutindo o histórico, as bases morais e os princípios que guiam a pesquisa moderna.</p>
              
              <div className="flex items-center gap-4 mt-8 p-4 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-slate-300"></div>
                <div>
                  <h4 className="font-bold text-[#1E4658]">Dra. Marina Silva</h4>
                  <p className="text-sm text-slate-500">Médica Veterinária Especialista, Vivens Consultoria</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar Curriculum */}
        <aside className="w-80 bg-white overflow-hidden flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-bold text-[#1E4658]">Conteúdo do Curso</h3>
          </div>
          
          <div className="flex-1 overflow-auto">
            {/* Module 1 */}
            <div className="border-b border-slate-100">
              <div className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer">
                <h4 className="font-semibold text-[#1E4658] text-sm">Módulo 1: Fundamentos</h4>
                <span className="text-xs font-medium text-slate-500">2/3</span>
              </div>
              <div className="py-2">
                <button className="w-full flex items-start gap-3 p-3 px-4 bg-[#5BB2A1]/10 text-left">
                  <CheckCircle size={18} className="text-[#5BB2A1] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-[#1E4658] block">1.1 Introdução à Ética Animal</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-1"><PlayCircle size={12}/> 15 min</span>
                  </div>
                </button>
                <button className="w-full flex items-start gap-3 p-3 px-4 hover:bg-slate-50 text-left transition-colors">
                  <CheckCircle size={18} className="text-slate-300 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-slate-600 block">1.2 Histórico dos 3Rs</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-1"><PlayCircle size={12}/> 22 min</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Module 2 */}
            <div className="border-b border-slate-100">
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                <h4 className="font-semibold text-[#1E4658] text-sm">Módulo 2: Legislação</h4>
                <span className="text-xs font-medium text-slate-500">0/4</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
