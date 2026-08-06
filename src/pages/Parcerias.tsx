import { Card, CardContent } from "@/components/ui/card";

const Parcerias = () => {
    return (
        <div className="min-h-screen">
            <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl font-bold mb-6">Parcerias</h1>
                        <p className="text-xl opacity-90">
                            Juntos somos mais fortes: colaboração para o avanço da ciência
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <p className="text-lg text-muted-foreground text-justify leading-relaxed mb-8">
                            Na <span className="font-bold text-primary">Vivens</span>, acreditamos que o progresso da Ciência de Animais de Laboratório (CAL) não se constrói isoladamente. É através de laços sólidos e parcerias estratégicas que conseguimos impulsionar a inovação, elevar os padrões de bem-estar animal e garantir a excelência científica.
                        </p>
                        <p className="text-lg text-muted-foreground text-justify leading-relaxed">
                            Valorizamos profundamente as conexões que estabelecemos com instituições e empresas que compartilham da nossa visão e compromisso ético. Essas alianças são fundamentais para criar um ecossistema colaborativo, onde o conhecimento flui e as soluções se multiplicam, beneficiando toda a comunidade científica e, acima de tudo, os animais.
                        </p>
                    </div>

                    <h2 className="text-3xl font-bold mb-12 text-primary border-b pb-2 text-center">Nossos Parceiros</h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center justify-items-center max-w-6xl mx-auto">
                        <Card className="w-full h-48 hover:shadow-xl transition-all duration-300 group">
                            <CardContent className="h-full bg-white p-6 flex items-center justify-center">
                                <img
                                    src="/lab-science-logo.png"
                                    alt="Lab Science Academy"
                                    className="max-h-full max-w-full object-contain filter group-hover:brightness-110 transition-all"
                                />
                            </CardContent>
                        </Card>

                        <Card className="w-full h-48 hover:shadow-xl transition-all duration-300 group">
                            <CardContent className="h-full bg-white p-6 flex items-center justify-center">
                                <img
                                    src="/ms-logo.jpg"
                                    alt="MS"
                                    className="max-h-full max-w-full object-contain filter group-hover:brightness-110 transition-all"
                                />
                            </CardContent>
                        </Card>

                        <Card className="w-full h-48 hover:shadow-xl transition-all duration-300 group">
                            <CardContent className="h-full bg-white p-6 flex items-center justify-center">
                                <img
                                    src="/lg-macedo-logo.png"
                                    alt="LG Macedo Consultoria"
                                    className="max-h-full max-w-full object-contain filter group-hover:brightness-110 transition-all"
                                />
                            </CardContent>
                        </Card>

                        <a href="http://www.mafrabiosafety.com.br/" target="_blank" rel="noopener noreferrer" className="w-full cursor-pointer">
                            <Card className="w-full h-48 hover:shadow-xl transition-all duration-300 group">
                                <CardContent className="h-full bg-white p-6 flex items-center justify-center">
                                    <img
                                        src="/mafra-logo.jpg"
                                        alt="Mafra Biosafety"
                                        className="max-h-full max-w-full object-contain filter group-hover:brightness-110 transition-all"
                                    />
                                </CardContent>
                            </Card>
                        </a>

                        <a href="https://www.grupobiotec.com.br/" target="_blank" rel="noopener noreferrer" className="w-full cursor-pointer">
                            <Card className="w-full h-48 hover:shadow-xl transition-all duration-300 group">
                                <CardContent className="h-full bg-white p-6 flex items-center justify-center">
                                    <img
                                        src="/biotec-logo.png"
                                        alt="Grupo Biotec"
                                        className="max-h-full max-w-full object-contain filter group-hover:brightness-110 transition-all"
                                    />
                                </CardContent>
                            </Card>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Parcerias;
