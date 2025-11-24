import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const Equipe = () => {
  const team = [
    {
      name: "Luisa Maria Gomes de Macedo Braga",
      role: "Sócia Proprietária e Consultora Científica",
      image: "/luisa-braga.jpg", // Placeholder path
      bio: "Médica veterinária, trabalhando com ciência de animais de laboratório e ética desde sua graduação. Mestre em Ciências Veterinárias, com ênfase em Embriologia e Doutora em Genética e Biologia Molecular, pela UFRGS. Pós-doutorado em Terapia Celular, pelo Instituto de Cardiologia/RS e INCOR/USP. Ex-presidente da Sociedade Brasileira de Ciência em Animais de Laboratório (SBCAL). Ex-coordenadora do Conselho Nacional de Controle da Experimentação Animal (CONCEA), onde também atuou como coordenadora da Câmara Permanente de Produção e na coordenação geral e organização do Guia Brasileiro de Produção, Manutenção ou Utilização de Animais de Laboratório. Vice-presidente da Academia Brasileira de Ciências de Animais de Laboratório (ABCAL). Especialista em Gestão, Liderança e Coaching pela PUCRS. Tem experiência em gerenciamento de biotérios de roedores, tanto de produção quanto de experimentação animal. Hoje atua como consultora cientifica e sócia proprietária nas empresas LGMACEDO CONSULTORIA e DESENVOLVIMENTO CIENTÍFICO e VIVENS CONSULTORIA.",
      contact: {
        phone: "(51) 99915-4684",
        email: "lgmacedo@gmail.com",
        linkedin: "https://www.linkedin.com/in/luisa-maria-gomes-de-macedo-braga-8b2b1150",
        instagram: "luisamgmb",
        lattes: "http://lattes.cnpq.br/1415840218265113"
      }
    },
    {
      name: "Jivago Rôlo",
      role: "Chief Scientific Officer",
      image: "/jivago-rolo.jpg",
      bio: "PhD em Ciências Biológicas com mais de 15 anos de experiência em pesquisa pré-clínica e desenvolvimento de modelos animais. Especialista em regulamentação CONCEA/ANVISA."
    },
    {
      name: "Marta Speck",
      role: "Gerente de Bem-estar Animal",
      image: "/marta-speck.jpg",
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
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="w-32 h-32 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-12 h-12 text-secondary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                      <p className="text-secondary font-semibold mb-3">{member.role}</p>
                      <p className="text-muted-foreground mb-4 text-justify">{member.bio}</p>

                      {member.contact && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mt-4 border-t pt-4">
                          {member.contact.phone && <p>📞 {member.contact.phone}</p>}
                          {member.contact.email && <p>✉️ {member.contact.email}</p>}
                          {member.contact.instagram && <p>📸 @{member.contact.instagram}</p>}
                          {member.contact.linkedin && (
                            <a href={member.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              🔗 LinkedIn
                            </a>
                          )}
                          {member.contact.lattes && (
                            <a href={member.contact.lattes} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              📄 Currículo Lattes
                            </a>
                          )}
                        </div>
                      )}
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

// Triggering new deployment after repo visibility change
