import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const AvaLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Erro ao fazer login");
      } else if (data.session) {
        toast.success("Login efetuado com sucesso!");
        navigate("/ava/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="w-1/2 bg-[#1E4658] flex items-center justify-center relative overflow-hidden">
        {/* Placeholder image or abstract shape */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center blend-overlay" />
        <div className="relative z-10 text-center text-white px-12">
          <h1 className="text-4xl font-bold mb-4">Vivens AVA</h1>
          <p className="text-xl">Plataforma premium de aprendizagem contínua.</p>
        </div>
      </div>
      <div className="w-1/2 bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-[#1E4658] mb-8">Bem-vindo de volta</h2>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#5BB2A1] focus:border-[#5BB2A1] outline-none transition-all" 
                placeholder="seu@email.com" 
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#5BB2A1] focus:border-[#5BB2A1] outline-none transition-all" 
                placeholder="••••••••" 
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-slate-300 text-[#5BB2A1] shadow-sm focus:border-[#5BB2A1] focus:ring focus:ring-[#5BB2A1] focus:ring-opacity-50" />
                <span className="ml-2 text-sm text-slate-600">Lembrar-me</span>
              </label>
              <a href="#" className="text-sm font-medium text-[#5BB2A1] hover:text-[#4a9787]">Esqueceu a senha?</a>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#5BB2A1] hover:bg-[#4a9787] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar na Plataforma"}
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
