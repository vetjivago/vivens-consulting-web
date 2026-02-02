import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Layout, Database, BarChart3, Settings, ArrowRight, ShieldCheck, Cpu } from "lucide-react";

const SistemasGestao = () => {
    return (
        <div className="min-h-screen">
            <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl font-bold mb-6">Sistemas de Gestão Personalizados</h1>
                        <p className="text-xl opacity-90">
                            Transformando a complexidade do seu biotério em processos digitais eficientes e integrados.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto mb-16 text-center">
                        <h2 className="text-4xl font-bold mb-6">Soluções Modeladas à sua Necessidade</h2>
                        <p className="text-lg text-muted-foreground">
                            Não acreditamos em soluções genéricas. Na Vivens, desenvolvemos sistemas de gestão que se adaptam
                            perfeitamente aos fluxos de trabalho da sua instituição, garantindo conformidade,
                            rastreabilidade e eficiência total.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <Card className="border-none shadow-md bg-secondary/5">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Cpu className="w-6 h-6 text-secondary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">BiotNEA</h3>
                                <p className="text-muted-foreground">
                                    Nosso software carro-chefe para gestão completa de biotérios, cobrindo desde o estoque até protocolos éticos.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md bg-secondary/5">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Settings className="w-6 h-6 text-secondary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Customização Total</h3>
                                <p className="text-muted-foreground">
                                    Modelamos módulos específicos para atender às particularidades operacionais e científicas do seu projeto.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md bg-secondary/5">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                                    <BarChart3 className="w-6 h-6 text-secondary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Dashboards Inteligentes</h3>
                                <p className="text-muted-foreground">
                                    Visualização de dados em tempo real para tomada de decisão baseada em indicadores precisos de produtividade e bem-estar.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Por que escolher nossos sistemas?</h2>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <ShieldCheck className="text-secondary mt-1 flex-shrink-0" />
                                        <div>
                                            <span className="font-semibold block">Segurança e Conformidade</span>
                                            <span className="text-muted-foreground">Sistemas desenvolvidos sob as normas do CONCEA e padrões internacionais.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Database className="text-secondary mt-1 flex-shrink-0" />
                                        <div>
                                            <span className="font-semibold block">Rastreabilidade Completa</span>
                                            <span className="text-muted-foreground">Histórico detalhado de cada animal e protocolo experimental.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Layout className="text-secondary mt-1 flex-shrink-0" />
                                        <div>
                                            <span className="font-semibold block">Interface Intuitiva</span>
                                            <span className="text-muted-foreground">Foco na experiência do usuário para facilitar a adoção pela equipe técnica.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-muted rounded-2xl p-8 flex items-center justify-center aspect-square">
                                <div className="text-center">
                                    <Layout size={80} className="text-secondary mb-4 mx-auto opacity-20" />
                                    <p className="text-sm font-medium text-muted-foreground">Representação Visual do Sistema</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Pronto para digitalizar sua gestão?</h2>
                    <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                        Agende uma demonstração do BiotNEA ou solicite um estudo para um sistema customizado.
                    </p>
                    <Button variant="secondary" size="xl" asChild>
                        <Link to="/contato">
                            Falar com um Especialista <ArrowRight className="ml-2" size={20} />
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default SistemasGestao;
