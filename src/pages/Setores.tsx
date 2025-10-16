import { Card, CardContent } from "@/components/ui/card";
import { Building2, FlaskConical, Pill, Microscope, Heart, Building } from "lucide-react";

const Setores = () => {
  const sectors = [
    {
      icon: Building2,
      title: "Instituições Acadêmicas e de Pesquisa",
      percentage: "40%",
      description: "Universidades, institutos de pesquisa e centros acadêmicos que desenvolvem estudos básicos e aplicados",
      services: [
        "Suporte em protocolos de pesquisa",
        "Treinamento de pesquisadores",
        "Consultoria em ética e bem-estar",
        "Parcerias de longo prazo"
      ]
    },
    {
      icon: Pill,
      title: "Indústria Farmacêutica",
      percentage: "45%",
      description: "Empresas farmacêuticas em desenvolvimento de novos medicamentos e terapias avançadas",
      services: [
        "Estudos toxicológicos GLP",
        "Modelos pré-clínicos customizados",
        "Suporte regulatório ANVISA",
        "Desenvolvimento de novos fármacos"
      ]
    },
    {
      icon: Microscope,
      title: "Empresas de Biotecnologia",
      percentage: "20%",
      description: "Biotechs focadas em terapias inovadoras, imuno-oncologia e medicina de precisão",
      services: [
        "Modelos transgênicos especializados",
        "Estudos de eficácia e segurança",
        "Análises moleculares avançadas",
        "Consultoria em desenvolvimento"
      ]
    },
    {
      icon: Building,
      title: "Organizações Governamentais",
      percentage: "10%",
      description: "Órgãos públicos de pesquisa em saúde, vigilância sanitária e desenvolvimento científico",
      services: [
        "Estudos de interesse público",
        "Validação de metodologias",
        "Treinamento de pessoal",
        "Parcerias institucionais"
      ]
    },
    {
      icon: FlaskConical,
      title: "CROs (Contract Research Organizations)",
      percentage: "10%",
      description: "Organizações de pesquisa por contrato que necessitam de serviços especializados complementares",
      services: [
        "Serviços terceirizados especializados",
        "Capacidade adicional sob demanda",
        "Expertise em modelos específicos",
        "Parcerias estratégicas"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Setores Atendidos</h1>
            <p className="text-xl opacity-90">
              Soluções especializadas para diversos segmentos da pesquisa pré-clínica
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6 text-center">Nossos Clientes</h2>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
              Atendemos uma ampla gama de setores, oferecendo soluções personalizadas para cada necessidade 
              específica, sempre com o mesmo compromisso com qualidade e ética.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sectors.map((sector, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <sector.icon className="w-8 h-8 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">{sector.title}</h3>
                        <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-semibold">
                          {sector.percentage}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{sector.description}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Serviços Especializados:</h4>
                    <ul className="space-y-2">
                      {sector.services.map((service, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="w-16 h-16 text-secondary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Tendências do Mercado</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Estamos alinhados com as principais tendências globais em pesquisa pré-clínica
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-6 bg-background rounded-lg">
                <h4 className="font-semibold mb-2">Modelos Avançados</h4>
                <p className="text-sm text-muted-foreground">
                  Demanda crescente por modelos geneticamente modificados e específicos
                </p>
              </div>
              <div className="p-6 bg-background rounded-lg">
                <h4 className="font-semibold mb-2">Métodos Alternativos</h4>
                <p className="text-sm text-muted-foreground">
                  Ênfase em alternativas aos testes em animais e práticas 3Rs
                </p>
              </div>
              <div className="p-6 bg-background rounded-lg">
                <h4 className="font-semibold mb-2">Áreas Emergentes</h4>
                <p className="text-sm text-muted-foreground">
                  Crescimento em imunologia, oncologia e neurociências
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Setores;
