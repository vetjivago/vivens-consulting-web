export const AvaLogin = () => {
  return (
    <div className="flex h-screen w-full">
      <div className="w-1/2 bg-[#1E4658] flex items-center justify-center relative overflow-hidden">
        {/* Placeholder image or abstract shape */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center blend-overlay" />
        <div className="relative z-10 text-center text-white px-12">
          <h1 className="text-4xl font-bold mb-4">Vivens VLE</h1>
          <p className="text-xl">Plataforma premium de aprendizagem contínua.</p>
        </div>
      </div>
      <div className="w-1/2 bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-[#1E4658] mb-8">Bem-vindo de volta</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input type="email" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#5BB2A1] focus:border-[#5BB2A1] outline-none transition-all" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input type="password" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#5BB2A1] focus:border-[#5BB2A1] outline-none transition-all" placeholder="••••••••" />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-slate-300 text-[#5BB2A1] shadow-sm focus:border-[#5BB2A1] focus:ring focus:ring-[#5BB2A1] focus:ring-opacity-50" />
                <span className="ml-2 text-sm text-slate-600">Lembrar-me</span>
              </label>
              <a href="#" className="text-sm font-medium text-[#5BB2A1] hover:text-[#4a9787]">Esqueceu a senha?</a>
            </div>
            <button type="button" className="w-full bg-[#5BB2A1] hover:bg-[#4a9787] text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              Entrar na Plataforma
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-slate-600">
            Ainda não tem conta? <a href="#" className="font-medium text-[#5BB2A1] hover:text-[#4a9787]">Cadastre-se</a>
          </p>
        </div>
      </div>
    </div>
  );
};
