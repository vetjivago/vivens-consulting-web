import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Award, TrendingUp } from "lucide-react";

const Sobre = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Sobre a Vivens</h1>
            <p className="text-xl opacity-90">
              Liderando o futuro da pesquisa pré-clínica ética no Brasil
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Nossa História</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                A Vivens Consultoria Científica nasceu da necessidade de elevar os padrões de pesquisa pré-clínica no Brasil, 
                combinando excelência científica com compromisso ético inabalável no tratamento de animais de laboratório.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Sediada em Brasília com atuação nacional, somos uma Organização de Pesquisa por Contrato (CRO) full-service, 
                especializada em estudos in vivo, consultoria regulatória CONCEA/ANVISA e tecnologias 3Rs (Substituição, Redução e Refinamento).
              </p>
              <p className="text-lg text-muted-foreground">
                Nosso compromisso vai além da ciência de qualidade: trabalhamos para que cada pesquisa realizada contribua 
                para o avanço do conhecimento científico, respeitando integralmente o bem-estar dos animais envolvidos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Missão</h3>
                <p className="text-muted-foreground">
                  Fornecer serviços de alta qualidade e ética na gestão e ciência de animais de laboratório, 
                  contribuindo para o avanço científico com responsabilidade e respeito ao bem-estar animal.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Visão</h3>
                <p className="text-muted-foreground">
                  Ser líder em soluções inovadoras para a ciência animal, reconhecida pela excelência técnica 
                  e pelo compromisso com práticas éticas e sustentáveis em pesquisa pré-clínica.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Nossa Trajetória</h2>
            <div className="space-y-8 mb-20">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-32 text-right">
                  <div className="text-2xl font-bold text-secondary">2024</div>
                </div>
                <div className="flex-grow border-l-4 border-secondary pl-6 pb-8">
                  <h3 className="text-xl font-semibold mb-2">Fundação da Vivens</h3>
                  <p className="text-muted-foreground">
                    Criação da empresa com foco em pesquisa pré-clínica ética e de alta qualidade, 
                    estabelecendo parcerias estratégicas com instituições de pesquisa.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-32 text-right">
                  <div className="text-2xl font-bold text-secondary">2025</div>
                </div>
                <div className="flex-grow border-l-4 border-secondary pl-6 pb-8">
                  <h3 className="text-xl font-semibold mb-2">Inauguração do Centro PD&I</h3>
                  <p className="text-muted-foreground">
                    Lançamento das instalações de 1.500 m² com biotério SPF, laboratórios analíticos 
                    certificados GLP e tecnologias 3Rs integradas.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-32 text-right">
                  <div className="text-2xl font-bold text-secondary">2026-27</div>
                </div>
                <div className="flex-grow border-l-4 border-secondary pl-6">
                  <h3 className="text-xl font-semibold mb-2">Expansão e Certificações</h3>
                  <p className="text-muted-foreground">
                    Obtenção de certificações internacionais (ISO 17025, GLP), expansão do portfólio 
                    de serviços e consolidação como referência nacional em pesquisa pré-clínica ética.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-12 text-center">Nossos Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Excelência</h3>
                <p className="text-muted-foreground">
                  Compromisso com os mais altos padrões de qualidade científica e técnica
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ética</h3>
                <p className="text-muted-foreground">
                  Respeito integral ao bem-estar animal e práticas transparentes
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Inovação</h3>
                <p className="text-muted-foreground">
                  Busca constante por soluções tecnológicas e metodologias avançadas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Mercado e Oportunidades</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Mercado Global</h3>
                  <p className="text-muted-foreground">
                    O mercado global de animais de laboratório foi avaliado em <strong>US$ 10,7 bilhões em 2023</strong>, 
                    com projeção de crescimento anual de <strong>8,2% até 2030</strong>. Este crescimento é impulsionado 
                    pelo aumento de investimentos em P&D, expansão da indústria farmacêutica e biotecnológica, 
                    e crescimento da pesquisa acadêmica.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Nossos Segmentos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-secondary mb-1">40%</div>
                      <div className="text-sm text-muted-foreground">Instituições Acadêmicas</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-secondary mb-1">45%</div>
                      <div className="text-sm text-muted-foreground">Indústria Farmacêutica</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-secondary mb-1">20%</div>
                      <div className="text-sm text-muted-foreground">Biotecnologia</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sobre;
