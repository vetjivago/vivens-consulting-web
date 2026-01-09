import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  FlaskConical,
  GraduationCap,
  Shield,
  Users,
  Award,
  Microscope,
  Heart,
  Building2,
  ArrowRight
} from "lucide-react";
import teamImage from "@/assets/team-collab.jpg";
import facilityImage from "@/assets/facility.jpg";

const Home = () => {
  const services = [
    {
      icon: FlaskConical,
      title: "Testes Pré-clínicos (em breve)",
      description: "Estudos toxicológicos de doses repetidas, MTD e protocolos customizados",
      link: "/servicos/toxicologia"
    },
    {
      icon: Users,
      title: "Consultoria Científica",
      description: "Soluções personalizadas em pesquisa e conformidade regulatória CONCEA/ANVISA",
      link: "/servicos/consultoria"
    },
    {
      icon: GraduationCap,
      title: "Educação e Treinamento",
      description: "Cursos em Ciência de Animais de Laboratório e Gestão da Qualidade",
      link: "/servicos/educacao"
    },
    {
      icon: Shield,
      title: "Bem-estar Animal",
      description: "Foco em ética e práticas 3Rs para garantir o bem-estar dos animais",
      link: "/servicos/bem-estar"
    }
  ];

  const differentials = [
    {
      icon: Microscope,
      title: "Expertise Técnica Multidisciplinar",
      description: "Equipe composta por especialistas com sólida formação em ciências veterinárias, biotecnologia, gestão da qualidade, bioética e regulamentação sanitária, oferecendo uma visão integrada e estratégica."
    },
    {
      icon: Users,
      title: "Consultoria Especializada e Personalizada",
      description: "Projetos de adequação de instalações, desenho de fluxos operacionais, estruturação de biotérios, validação de protocolos e implementação de programas de bem-estar animal com soluções sob medida."
    },
    {
      icon: Shield,
      title: "Compromisso com a Conformidade",
      description: "Orientação técnica para atendimento às exigências do CONCEA, CEUA, ANVISA e demais órgãos reguladores, apoiando instituições no alcance de acreditações nacionais e internacionais."
    },
    {
      icon: Heart,
      title: "Integração Cuidado Animal e Pesquisa",
      description: "Suporte técnico desde a gestão de biotérios até a elaboração de protocolos experimentais, promovendo ambientes controlados, eficientes e alinhados à ciência translacional."
    },
    {
      icon: GraduationCap,
      title: "Inovação em Educação Científica",
      description: "Plataforma de capacitação com treinamentos técnicos, cursos e programas de formação continuada para profissionais e estudantes da ciência de animais de laboratório."
    }
  ];

  return (
    <div className="min-h-screen">
      <Hero />

      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nossos Serviços</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Soluções completas em ciência pré-clínica com foco em qualidade e ética
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link key={index} to={service.link}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                  <CardContent className="p-6">
                    <service.icon className="w-12 h-12 text-secondary mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="cta" size="lg" asChild>
              <Link to="/servicos">
                Ver Todos os Serviços <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Por que escolher a Vivens?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Combinamos excelência científica com compromisso ético, oferecendo serviços que atendem aos mais altos padrões de qualidade e bem-estar animal.
              </p>

              <div className="space-y-6">
                {differentials.map((diff, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <diff.icon className="w-6 h-6 text-secondary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{diff.title}</h3>
                      <p className="text-muted-foreground">{diff.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button variant="default" size="lg" asChild>
                  <Link to="/sobre">Conheça Nossa História</Link>
                </Button>
              </div>

              <div className="mt-16">
                <h3 className="text-2xl font-bold mb-6">Nossos Parceiros e Clientes</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-muted/50 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                      <span className="text-sm text-muted-foreground font-semibold">Cliente {i}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={teamImage}
                alt="Equipe Vivens colaborando em pesquisa"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Vivens em Números</h2>
            <p className="text-xl opacity-90">Dados que refletem nosso compromisso com a excelência</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">1.500</div>
              <div className="opacity-90">m² de instalações</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">80</div>
              <div className="opacity-90">Racks ventilados SPF</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="opacity-90">Conformidade CONCEA</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">3Rs</div>
              <div className="opacity-90">Práticas éticas</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={facilityImage}
                alt="Instalações modernas da Vivens"
                className="rounded-lg shadow-xl w-full"
              />
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold mb-6">Infraestrutura de Excelência</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Nossas instalações SPF de última geração são equipadas com tecnologias avançadas para garantir a qualidade e a segurança de todos os estudos realizados.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">1.500 m² de área construída com barreiras sanitárias</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">80 racks ventilados SPF de alta eficiência</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Laboratórios analíticos com certificação GLP</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-muted-foreground">Plataforma digital integrada (LIMS + AI-3Rs)</span>
                </li>
              </ul>
              <Button variant="default" size="lg" asChild>
                <Link to="/infraestrutura">Conheça Nossa Infraestrutura</Link>
              </Button>
            </div>
          </div>
        </div>
      </section> 
      */}

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para começar seu projeto?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos ajudar sua pesquisa a alcançar novos patamares com ética e excelência.
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

export default Home;
