import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const Equipe = () => {
  const team = [
    {
      name: "Jivago Rôlo",
      role: "Chief Scientific Officer",
      bio: "PhD em Ciências Biológicas com mais de 15 anos de experiência em pesquisa pré-clínica e desenvolvimento de modelos animais. Especialista em regulamentação CONCEA/ANVISA."
    },
    {
      name: "Luisa Macedo Braga",
      role: "Diretora de Qualidade e Conformidade",
      bio: "Mestre em Medicina Veterinária, especialista em Gestão da Qualidade para Biotérios e certificação GLP. Responsável por auditorias e implementação de sistemas de qualidade."
    },
    {
      name: "Marta Speck",
      role: "Gerente de Bem-estar Animal",
      bio: "Médica Veterinária com especialização em Medicina de Animais de Laboratório. Lidera programas de bem-estar animal e implementação de práticas 3Rs na instituição."
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Nossa Equipe</h1>
            <p className="text-xl opacity-90">
              Profissionais altamente qualificados dedicados à excelência científica
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-10 h-10 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                      <p className="text-secondary font-semibold mb-3">{member.role}</p>
                      <p className="text-muted-foreground">{member.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Equipe;
