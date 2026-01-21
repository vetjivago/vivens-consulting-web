import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TestPage = () => {
    return (
        <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-gemini-800 mb-4">Página de Teste</h1>
                <p className="text-gray-600 mb-6">
                    Se você está vendo esta página, significa que o deploy foi atualizado com sucesso!
                </p>
                <div className="p-4 bg-green-50 text-green-700 rounded-md border border-green-200 mb-6">
                    <p className="font-semibold">Status: Operacional</p>
                    <p className="text-sm opacity-75">{new Date().toLocaleString('pt-BR')}</p>
                </div>
                <Link to="/">
                    <Button variant="default" className="w-full">
                        Voltar para Home
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default TestPage;
