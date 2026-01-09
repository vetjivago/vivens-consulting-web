import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileCheck, Shield, Award, TrendingUp, ArrowRight } from "lucide-react";

const Consultoria = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Consultoria Científica</h1>
            <p className="text-xl opacity-90">
              Soluções personalizadas para otimizar sua pesquisa pré-clínica
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">Excelência em Consultoria</h2>
            <p className="text-lg text-muted-foreground">
              Nossa equipe de especialistas oferece consultoria abrangente para garantir que sua pesquisa atenda
              aos mais altos padrões de qualidade, conformidade regulatória e eficiência operacional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Consultoria em Pesquisa</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Desenho experimental e protocolos</li>
                  <li>• Seleção de modelos animais adequados</li>
                  <li>• Otimização de metodologias</li>
                  <li>• Análise estatística e interpretação de dados</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Conformidade Regulatória</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Adequação às normas CONCEA</li>
                  <li>• Parcerias sob demanda (ANVISA e outros)</li>
                  <li>• Preparação de documentação técnica</li>
                  <li>• Apoio em auditorias e inspeções</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Acreditações</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Preparação para acreditação AAALAC International</li>
                  <li>• Conformidade com princípios BPL</li>
                  <li>• Implementação de sistemas de qualidade</li>
                  <li>• Parcerias sob demanda (ISO 9001, ISO 17025)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Otimização de Processos</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Diagnóstico e otimização de processos em biotérios</li>
                  <li>• Aplicação de metodologias ágeis à gestão operacional</li>
                  <li>• Implantação de práticas alinhadas aos 3Rs</li>
                  <li>• Programas de melhoria contínua e eficiência operacional</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Infraestrutura e Fluxos</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Consultoria em plantas e edificações para biotérios</li>
                  <li>• Planejamento de fluxos operacionais e sanitários</li>
                  <li>• Adequação de instalações às normas vigentes</li>
                  <li>• Projetos de barreiras sanitárias e áreas de apoio</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Precisa de consultoria especializada?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Entre em contato e descubra como nossa consultoria pode otimizar sua pesquisa
          </p>
          <Button variant="cta" size="xl" asChild>
            <Link to="/contato">
              Solicitar Orçamento <ArrowRight className="ml-2" size={20} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Consultoria;
