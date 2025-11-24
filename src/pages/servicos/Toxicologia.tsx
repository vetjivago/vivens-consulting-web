import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FlaskConical, ArrowRight } from "lucide-react";

const Toxicologia = () => {
  const studies = [
    {
      title: "Estudo de Dose Máxima Tolerada (MTD)",
      description: "Determinação da dose máxima que pode ser administrada sem causar efeitos adversos graves"
    },
    {
      title: "Toxicidade Oral de 14 Dias",
      description: "Avaliação de toxicidade aguda e subaguda com administração oral repetida por 14 dias"
    },
    {
      title: "Toxicidade Oral de 28 Dias",
      description: "Estudo de toxicidade subaguda com administração repetida por 28 dias, conforme guidelines OECD"
    },
    {
      title: "Toxicidade Oral de 90 Dias",
      description: "Estudo de toxicidade subcrônica para avaliação de efeitos em exposição prolongada"
    },
    {
      title: "Toxicidade Oral de 180 Dias",
      description: "Avaliação de toxicidade crônica com exposição de longo prazo"
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Testes Pré-clínicos - Toxicologia</h1>
            <p className="text-xl opacity-90">
              Estudos toxicológicos completos seguindo padrões GLP e regulamentações internacionais
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">Estudos Toxicológicos de Alta Qualidade</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Realizamos estudos toxicológicos completos seguindo protocolos internacionais (OECD, ICH, FDA) 
              e normas regulatórias brasileiras (ANVISA, CONCEA), com foco em precisão científica e bem-estar animal.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Nossa infraestrutura certificada GLP e equipe especializada garantem resultados confiáveis 
              para submissões regulatórias e desenvolvimento de produtos seguros.
            </p>

            <div className="space-y-6">
              {studies.map((study, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FlaskConical className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{study.title}</h3>
                        <p className="text-muted-foreground">{study.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-muted/30">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">Estudos Sob Demanda</h3>
                <p className="text-muted-foreground">
                  Além dos estudos listados, estamos preparados para desenvolver <strong>protocolos adicionais sob demanda</strong>, 
                  conforme as necessidades específicas do projeto, garantindo flexibilidade para atender objetivos experimentais diversos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Nosso Diferencial</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">GLP</div>
                <p className="text-muted-foreground">Certificação em Boas Práticas de Laboratório</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">OECD</div>
                <p className="text-muted-foreground">Protocolos seguindo diretrizes internacionais</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">3Rs</div>
                <p className="text-muted-foreground">Compromisso com práticas éticas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Precisa realizar estudos toxicológicos?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Entre em contato e descubra como podemos apoiar sua pesquisa
          </p>
          <Button variant="secondary" size="xl" asChild>
            <Link to="/contato">
              Solicitar Orçamento <ArrowRight className="ml-2" size={20} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Toxicologia;
