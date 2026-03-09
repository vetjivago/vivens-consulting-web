import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Stethoscope, Shield, Activity, ClipboardCheck, ArrowRight } from "lucide-react";

const Veterinaria = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Cuidados Veterinários</h1>
            <p className="text-xl opacity-90">
              Serviços veterinários especializados para animais de laboratório
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">Excelência em Medicina Veterinária</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Nossa equipe de veterinários especializados oferece cuidados abrangentes para garantir 
              a saúde e bem-estar de todos os animais sob nossa responsabilidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Medicina Preventiva</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Programas de vacinação</li>
                  <li>• Controle de parasitas</li>
                  <li>• Quarentena e aclimatação</li>
                  <li>• Medicina de colônias</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Diagnóstico e Tratamento</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Exames clínicos especializados</li>
                  <li>• Diagnóstico laboratorial</li>
                  <li>• Tratamento de enfermidades</li>
                  <li>• Procedimentos cirúrgicos</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Monitoramento Sanitário SPF</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Monitoramento microbiológico</li>
                  <li>• Vigilância sanitária contínua</li>
                  <li>• Controle de qualidade SPF</li>
                  <li>• Relatórios de status sanitário</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <ClipboardCheck className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Programas Personalizados</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Protocolos de saúde customizados</li>
                  <li>• Consultoria em bem-estar</li>
                  <li>• Gestão de saúde de colônias</li>
                  <li>• Treinamento de equipes</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Nossa Equipe Veterinária</h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              Contamos com veterinários especializados em medicina de animais de laboratório, 
              com formação em instituições de referência e experiência em diversos modelos animais.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-secondary mb-2">24/7</div>
                <p className="text-muted-foreground">Suporte veterinário</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-secondary mb-2">10+</div>
                <p className="text-muted-foreground">Veterinários especializados</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-secondary mb-2">SPF</div>
                <p className="text-muted-foreground">Certificação de qualidade</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Precisa de serviços veterinários especializados?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Entre em contato e conheça nossos programas de saúde animal
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

export default Veterinaria;
