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
                A Vivens nasce com o propósito de transformar a ciência de animais de laboratório por meio de uma abordagem ética, inovadora e tecnicamente qualificada. Atuamos na interseção entre o rigor científico e o compromisso com o bem-estar animal, oferecendo soluções completas para instituições que buscam excelência em pesquisa biomédica, conformidade regulatória e desempenho operacional.
              </p>
              <p className="text-lg text-muted-foreground">
                Nosso trabalho é sustentado por três pilares fundamentais: qualidade, ética e inovação. Acreditamos que é possível aliar o avanço científico ao respeito pela vida animal, promovendo práticas baseadas nos princípios dos 3Rs (Redução, Refinamento e Substituição) e em alinhamento às normativas nacionais e internacionais, como a Resolução CONCEA nº 51/2021 e as diretrizes da FELASA e OECD.
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
                  Nascemos da necessidade de reunir diversas expertises e mentes inovadoras em uma única força colaborativa. Nossa missão é integrar profissionais de múltiplas áreas para entregar soluções completas e de excelência em ciência de animais de laboratório, unindo ética, qualidade e técnica.
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
            {/* 
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
            */}

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
                  <h3 className="text-xl font-semibold mb-3">Potencial de Crescimento Acelerado</h3>
                  <p className="text-muted-foreground text-justify">
                    O mercado global de pesquisa pré-clínica e modelos animais projeta um crescimento vigoroso (CAGR ~8,2%), impulsionado pela explosão da biotecnologia, novas terapias gênicas e medicina personalizada. Para investidores, este cenário representa uma oportunidade única de alocar capital em um setor resiliente, de alta demanda e essencial para a inovação em saúde.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">O Diferencial da Especialização</h3>
                  <p className="text-muted-foreground mb-4 text-justify">
                    Apesar do alto potencial, o setor apresenta altas barreiras de entrada regulatórias e técnicas (CONCEA, ANVISA, AAALAC). O sucesso do investimento depende diretamente da eficiência operacional e da conformidade estrita.
                  </p>
                  <div className="bg-secondary/5 border-l-4 border-secondary p-4 mt-4">
                    <p className="text-sm italic text-muted-foreground">
                      "A Vivens atua como o parceiro estratégico que mitiga riscos e acelera o retorno sobre o investimento, garantindo que a infraestrutura e os processos operem com excelência desde o primeiro dia."
                    </p>
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
