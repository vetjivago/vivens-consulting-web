import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, CircleDot, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

const BemEstar = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Bem-estar Animal</h1>
            <p className="text-xl opacity-90">
              Compromisso ético e práticas avançadas para garantir o bem-estar em todos os processos
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">Nosso Compromisso</h2>
            <p className="text-lg text-muted-foreground mb-8">
              O bem-estar animal está no centro de tudo que fazemos. Implementamos as melhores práticas 
              internacionais e tecnologias avançadas para garantir que todos os animais sob nossos cuidados 
              recebam o tratamento mais ético e humanitário possível.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <CircleDot className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Substituição (Replace)</h3>
                <p className="text-muted-foreground">
                  Sempre que possível, utilizamos métodos alternativos que substituam o uso de animais, 
                  como modelos in vitro e simulações computacionais.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <CircleDot className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Redução (Reduce)</h3>
                <p className="text-muted-foreground">
                  Otimizamos protocolos experimentais para minimizar o número de animais necessários, 
                  sem comprometer a qualidade científica dos resultados.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <CircleDot className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Refinamento (Refine)</h3>
                <p className="text-muted-foreground">
                  Aprimoramos continuamente nossas práticas para minimizar dor, sofrimento e estresse, 
                  melhorando as condições de alojamento e manejo.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Enriquecimento Ambiental</h3>
                <p className="text-muted-foreground">
                  Implementamos programas de enriquecimento que promovem comportamentos naturais e 
                  melhoram a qualidade de vida dos animais.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Nossos Serviços em Bem-estar</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Avaliação e Monitoramento</h3>
                  <p className="text-muted-foreground">
                    Realizamos avaliações contínuas do bem-estar animal utilizando métodos científicos validados 
                    e indicadores comportamentais, fisiológicos e de saúde.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Consultoria CEUA</h3>
                  <p className="text-muted-foreground">
                    Apoiamos na elaboração e avaliação de protocolos para Comissões de Ética no Uso de Animais, 
                    garantindo conformidade com legislação e melhores práticas.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Treinamento em Bem-estar</h3>
                  <p className="text-muted-foreground">
                    Capacitamos equipes em reconhecimento de sinais de dor e sofrimento, pontos de intervenção humana 
                    e técnicas de manejo compassivo.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <ShieldCheck className="w-16 h-16 text-secondary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Certificações e Conformidade</h2>
            <p className="text-lg text-muted-foreground">
              Seguimos rigorosamente as diretrizes do CONCEA, ANVISA e padrões internacionais de bem-estar animal, 
              incluindo as diretrizes do Guide for the Care and Use of Laboratory Animals.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Quer saber mais sobre nossas práticas de bem-estar?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Entre em contato para conhecer nossos programas e protocolos
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

export default BemEstar;
