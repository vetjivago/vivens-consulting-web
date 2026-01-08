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
      bio: "Médico-veterinário e cientista com mestrado e doutorado em Biologia Animal e especializado em Ciência de Animais de Laboratório, FELASA SPECIALIST D. Atua na interface entre bem-estar animal, ética em pesquisa e desenho experimental aplicado à biomedicina. Tem experiência em gestão e modernização de biotérios acadêmicos, implementação de rotinas de biossegurança, padronização sanitária e alinhamento às diretrizes do CONCEA e normas internacionais, com foco em reprodutibilidade científica e redução do uso de animais. Desenvolve e ministra cursos, treinamentos e disciplinas voltados à ética, legislação, manejo, pontos finais humanitários e planejamento experimental, formando técnicos, estudantes de graduação e pós-graduação. Lidera ainda iniciativas que integram inteligência artificial e análise de comportamento animal para monitoramento objetivo de dor, estresse e bem-estar, além de projetos de educação científica e inovação tecnológica, como a Lab Science Academy e o AURIA, voltados a conectar pesquisa aplicada, formação profissional e soluções de alto impacto para a ciência de animais de laboratório.",
      contact: {
        email: "jivagorolo@gmail.com",
        linkedin: "https://www.linkedin.com/in/jivago-rolo",
        lattes: "http://lattes.cnpq.br/0401207763557481"
      }
    },
    {
      name: "Marta Lorena Speck da Silva",
      role: "Gerente de Bem-estar Animal",
      image: "/marta-speck.jpg",
      bio: "Graduada em Ciências Biológicas com ênfase em Biopatologia e mestre em Ciências Farmacêuticas pela UFRGS. Atualmente, sou doutoranda em Medicina Translacional pela UFC, Acadêmica Titular e Patrona da Cadeira n 6 da Academia Brasileira de Ciência em Animais de Laboratório (ABCAL). Minha atuação abrange as áreas de gestão da qualidade para biotérios, controle genético e monitoramento sanitário de animais de laboratório, além da produção e experimentação com roedores e peixes. Tenho ampla experiência na implementação de metodologias para o aprimoramento de processos, com foco na gestão da qualidade em biotérios e na garantia do bem-estar animal. Fui responsável pela implementação dos elevados padrões internacionais exigidos pela certificação AAALAC, tendo sido gestora do único biotério público no Brasil (UFC) acreditado por essa organização. Dessa forma, asseguro que todas as práticas de manejo e experimentação animal estejam alinhadas às melhores diretrizes globais de cuidado e ética, mantendo o bem-estar animal como prioridade em todas as fases dos processos laboratoriais.",
      contact: {
        email: "martaspeck@gmail.com",
        linkedin: "https://www.linkedin.com/in/marta-speck-b987b9139/",
        lattes: "http://lattes.cnpq.br/7259678197876031"
      }
    }
  ];

  const consultants = [
    // Placeholder for future consultants
  ];

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Equipe</h1>
            <p className="text-xl opacity-90">
              Profissionais altamente qualificados dedicados à excelência científica
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-primary border-b pb-2">Nossa Equipe</h2>
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

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-primary border-b pb-2">Consultores Associados</h2>
            {consultants.length > 0 ? (
              consultants.map((member: any, index) => (
                <Card key={index} className="mb-8">{/* Consultant Card Structure */}</Card>
              ))
            ) : (
              <p className="text-muted-foreground text-center italic">
                Em breve, apresentaremos nossos consultores associados.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Equipe;

// Triggering new deployment after repo visibility change
