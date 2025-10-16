import { Card, CardContent } from "@/components/ui/card";
import { Building2, Server, Microscope, Shield } from "lucide-react";
import facilityImage from "@/assets/facility.jpg";

const Infraestrutura = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Infraestrutura</h1>
            <p className="text-xl opacity-90">
              Instalações de última geração para pesquisa pré-clínica de excelência
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold mb-6">Centro de PD&I de Classe Mundial</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Nosso Centro de Pesquisa, Desenvolvimento e Inovação (PD&I) foi projetado para atender 
                aos mais rigorosos padrões internacionais de qualidade e biossegurança.
              </p>
              <p className="text-lg text-muted-foreground">
                Com 1.500 m² de área construída, oferecemos infraestrutura completa para estudos 
                pré-clínicos, garantindo precisão científica e bem-estar animal.
              </p>
            </div>
            <div>
              <img
                src={facilityImage}
                alt="Instalações modernas da Vivens"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-secondary" />
                </div>
                <div className="text-3xl font-bold text-secondary mb-2">1.500 m²</div>
                <p className="text-muted-foreground">Área Construída</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Server className="w-8 h-8 text-secondary" />
                </div>
                <div className="text-3xl font-bold text-secondary mb-2">80</div>
                <p className="text-muted-foreground">Racks Ventilados SPF</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Microscope className="w-8 h-8 text-secondary" />
                </div>
                <div className="text-3xl font-bold text-secondary mb-2">GLP</div>
                <p className="text-muted-foreground">Labs Analíticos</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-secondary" />
                </div>
                <div className="text-3xl font-bold text-secondary mb-2">NB-2</div>
                <p className="text-muted-foreground">Nível de Biossegurança</p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Recursos e Equipamentos</h2>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Biotério SPF</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 80 racks IVC (Individually Ventilated Cages) de alta eficiência</li>
                    <li>• Sistema de barreiras sanitárias e fluxo unidirecional</li>
                    <li>• Controle ambiental automatizado (temperatura, umidade, ciclo claro/escuro)</li>
                    <li>• Monitoramento microbiológico contínuo</li>
                    <li>• Salas de quarentena e aclimatação</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Laboratórios Analíticos</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• HPLC-MS/MS para análises farmacológicas e toxicológicas</li>
                    <li>• Citômetro de fluxo 4 lasers para imunofenotipagem</li>
                    <li>• Equipamentos de biologia molecular (PCR, qRT-PCR)</li>
                    <li>• Microscopia avançada (confocal, fluorescência)</li>
                    <li>• Certificação ISO 17025 e Boas Práticas de Laboratório (GLP)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Tecnologia e Automação</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• LIMS (Laboratory Information Management System) em nuvem</li>
                    <li>• Plataforma AI-3Rs para otimização de protocolos</li>
                    <li>• Monitoramento ambiental IoT em tempo real</li>
                    <li>• Sistema de rastreabilidade completa</li>
                    <li>• Análise de dados com inteligência artificial</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Segurança e Qualidade</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Autoclaves de grande porte para esterilização</li>
                    <li>• Sistemas de backup de energia e climatização</li>
                    <li>• Câmaras de segurança biológica classe II</li>
                    <li>• Programa de manutenção preventiva</li>
                    <li>• Auditorias internas e externas regulares</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Certificações e Conformidade</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Nossas instalações atendem a todos os requisitos regulatórios nacionais e internacionais
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 bg-background rounded-lg">
                <div className="font-bold text-primary mb-2">CONCEA</div>
                <p className="text-sm text-muted-foreground">Certificado</p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <div className="font-bold text-primary mb-2">ANVISA</div>
                <p className="text-sm text-muted-foreground">Conformidade</p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <div className="font-bold text-primary mb-2">ISO 17025</div>
                <p className="text-sm text-muted-foreground">Em processo</p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <div className="font-bold text-primary mb-2">GLP</div>
                <p className="text-sm text-muted-foreground">Certificação</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Infraestrutura;
