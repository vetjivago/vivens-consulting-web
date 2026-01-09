import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, Users, Award, ArrowRight } from "lucide-react";

const Educacao = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Educação e Treinamento</h1>
            <p className="text-xl opacity-90">
              Capacitação de excelência em ciência de animais de laboratório
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">Nossos Programas</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Oferecemos uma ampla gama de cursos e treinamentos especializados, ministrados por profissionais
              experientes e alinhados com as mais recentes diretrizes e regulamentações.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ciência de Animais de Laboratório</h3>
                <p className="text-muted-foreground mb-4">
                  Curso abrangente cobrindo fundamentos de biologia, manejo, bem-estar e uso ético de animais em pesquisa.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Biologia e comportamento animal</li>
                  <li>• Técnicas de manejo e contenção</li>
                  <li>• Princípios dos 3Rs</li>
                  <li>• Legislação e ética</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Gestão da Qualidade para Biotérios</h3>
                <p className="text-muted-foreground mb-4">
                  Treinamento especializado em sistemas de qualidade, GLP e certificações para biotérios.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Implementação de sistemas de qualidade</li>
                  <li>• Boas Práticas de Laboratório (GLP)</li>
                  <li>• Auditorias e inspeções</li>
                  <li>• Documentação e rastreabilidade</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Treinamento RN 49 CONCEA</h3>
                <p className="text-muted-foreground mb-4">
                  Capacitação conforme Resolução Normativa 49 do CONCEA para credenciamento de profissionais.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Requisitos da RN 49</li>
                  <li>• Procedimentos operacionais padrão</li>
                  <li>• Responsabilidades e competências</li>
                  <li>• Certificação oficial</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Workshops Customizados</h3>
                <p className="text-muted-foreground mb-4">
                  Treinamentos sob medida para atender necessidades específicas de sua instituição.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Conteúdo personalizado</li>
                  <li>• Formato flexível (presencial/online)</li>
                  <li>• Práticas hands-on</li>
                  <li>• Treinamento e desenvolvimento de equipes</li>
                  <li>• Material didático exclusivo</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Por que escolher nossos treinamentos?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-secondary mb-2">10+</div>
                <p className="text-muted-foreground">Anos de experiência combinada</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-secondary mb-2">500+</div>
                <p className="text-muted-foreground">Profissionais treinados</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-secondary mb-2">98%</div>
                <p className="text-muted-foreground">Taxa de satisfação</p>
              </div>
            </div>
          </div>
        </div>
      </section> 
      */}

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Interessado em nossos treinamentos?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Entre em contato para conhecer nossa programação e condições especiais
          </p>
          <Button variant="secondary" size="xl" asChild>
            <Link to="/contato">
              Solicitar Informações <ArrowRight className="ml-2" size={20} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Educacao;
