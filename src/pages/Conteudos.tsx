import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, FileText, GraduationCap, Video, ArrowRight, Download } from "lucide-react";

const Conteudos = () => {
  const contentCategories = [
    {
      icon: FileText,
      title: "Artigos Científicos",
      description: "Publicações e estudos de caso sobre pesquisa pré-clínica",
      items: [
        "Validação de modelos animais em oncologia",
        "Refinamento de técnicas para redução de dor",
        "Implementação de sistemas SPF em biotérios",
        "Análise estatística em estudos toxicológicos"
      ]
    },
    {
      icon: BookOpen,
      title: "Guias e Protocolos",
      description: "Materiais técnicos e orientações práticas",
      items: [
        "Manual de Boas Práticas em Biotérios",
        "Protocolos de Anestesia e Analgesia",
        "Guia de Contenção Humanitária",
        "Checklist de Conformidade Regulatória"
      ]
    },
    {
      icon: GraduationCap,
      title: "Material Educacional",
      description: "Recursos para capacitação e desenvolvimento profissional",
      items: [
        "Fundamentos de Ciência de Animais de Laboratório",
        "Introdução aos Princípios 3Rs",
        "Legislação e Ética em Experimentação Animal",
        "Desenho Experimental e Análise de Dados"
      ]
    },
    {
      icon: Video,
      title: "Webinars e Workshops",
      description: "Gravações de eventos e treinamentos especializados",
      items: [
        "Inovações em Toxicologia Pré-clínica",
        "Medicina Veterinária Preventiva em Biotérios",
        "Certificações GLP e ISO 17025",
        "Tecnologias Emergentes em Pesquisa Animal"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Conteúdos e Recursos</h1>
            <p className="text-xl opacity-90">
              Conhecimento técnico-científico para impulsionar sua pesquisa pré-clínica
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <h2 className="text-4xl font-bold mb-6">Biblioteca de Conhecimento</h2>
            <p className="text-lg text-muted-foreground">
              Compilamos materiais técnicos, artigos científicos e recursos educacionais para apoiar 
              profissionais e instituições no desenvolvimento de pesquisas de excelência.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {contentCategories.map((category, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                    <category.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{category.title}</h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {category.items.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-muted/30">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Download className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Downloads Disponíveis</h3>
                  <p className="text-muted-foreground mb-6">
                    Nossos materiais educacionais e guias técnicos estão disponíveis para download. 
                    Entre em contato para receber acesso aos conteúdos exclusivos da Vivens.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <div className="font-semibold">Catálogo de Serviços 2025</div>
                        <div className="text-sm text-muted-foreground">PDF - 2.5 MB</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Solicitar
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <div className="font-semibold">Manual de Conformidade Regulatória</div>
                        <div className="text-sm text-muted-foreground">PDF - 4.1 MB</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Solicitar
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <div className="font-semibold">Guia de Bem-estar Animal</div>
                        <div className="text-sm text-muted-foreground">PDF - 3.8 MB</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Solicitar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Newsletter Científica</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-lg text-muted-foreground mb-6">
                  Receba mensalmente conteúdos exclusivos, novidades do setor e insights sobre 
                  pesquisa pré-clínica diretamente no seu e-mail.
                </p>
                <Button variant="default" size="lg" asChild>
                  <Link to="/contato">
                    Inscrever-se na Newsletter <ArrowRight className="ml-2" size={20} />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Precisa de materiais específicos?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Entre em contato para solicitar conteúdos personalizados ou tirar dúvidas técnicas
          </p>
          <Button variant="secondary" size="xl" asChild>
            <Link to="/contato">
              Falar com Especialista <ArrowRight className="ml-2" size={20} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Conteudos;
