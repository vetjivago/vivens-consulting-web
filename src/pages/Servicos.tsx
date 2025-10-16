import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  FlaskConical, 
  Users, 
  GraduationCap, 
  Heart,
  Stethoscope,
  ArrowRight
} from "lucide-react";

const Servicos = () => {
  const services = [
    {
      icon: Users,
      title: "Consultoria Científica",
      description: "Soluções personalizadas em pesquisa, conformidade regulatória e otimização de processos",
      features: [
        "Consultoria em pesquisa pré-clínica",
        "Conformidade CONCEA/ANVISA",
        "Acreditações e certificações",
        "Otimização de protocolos"
      ],
      link: "/servicos/consultoria"
    },
    {
      icon: FlaskConical,
      title: "Testes Pré-clínicos - Toxicologia",
      description: "Estudos toxicológicos completos seguindo padrões GLP e regulamentações internacionais",
      features: [
        "Estudo de dose máxima tolerada (MTD)",
        "Toxicidade oral de 14, 28, 90 e 180 dias",
        "Protocolos customizados sob demanda",
        "Análises completas e relatórios GLP"
      ],
      link: "/servicos/toxicologia"
    },
    {
      icon: GraduationCap,
      title: "Educação e Treinamento",
      description: "Cursos e treinamentos especializados em ciência de animais de laboratório",
      features: [
        "Ciência de Animais de Laboratório",
        "Gestão da Qualidade para Biotérios",
        "Treinamento RN 49 CONCEA",
        "Workshops e capacitações customizadas"
      ],
      link: "/servicos/educacao"
    },
    {
      icon: Heart,
      title: "Bem-estar Animal",
      description: "Gestão ética e práticas 3Rs para garantir o bem-estar em todos os processos",
      features: [
        "Implementação de práticas 3Rs",
        "Avaliação e monitoramento contínuo",
        "Enriquecimento ambiental",
        "Consultoria em protocolos CEUA"
      ],
      link: "/servicos/bem-estar"
    },
    {
      icon: Stethoscope,
      title: "Cuidados Veterinários",
      description: "Serviços veterinários especializados para animais de laboratório",
      features: [
        "Medicina preventiva",
        "Diagnóstico e tratamento",
        "Monitoramento sanitário SPF",
        "Programas de saúde personalizados"
      ],
      link: "/servicos/veterinaria"
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Nossos Serviços</h1>
            <p className="text-xl opacity-90">
              Soluções completas em ciência pré-clínica com foco em qualidade, ética e inovação
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                    <service.icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button variant="default" asChild>
                    <Link to={service.link}>
                      Saiba Mais <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Precisa de um serviço personalizado?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Nossa equipe está pronta para desenvolver soluções sob medida para as necessidades específicas do seu projeto.
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

export default Servicos;
