import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

import ekaterinaImage from "@/assets/ekaterina-rivera.png";
import patriciaImage from "@/assets/patricia-silva.png";

const Equipe = () => {
  const team = [
    {
      name: "Luisa Maria Gomes de Macedo Braga",
      role: "Sócia Proprietária e Administradora",
      image: "/luisa-braga.jpg",
      bio: "Médica veterinária, trabalhando com ciência de animais de laboratório e ética desde sua graduação. Mestre em Ciências Veterinárias, com ênfase em Embriologia e Doutora em Genética e Biologia Molecular, pela UFRGS. Pós-doutorado em Terapia Celular, pelo Instituto de Cardiologia/RS e INCOR/USP. Ex-presidente da Sociedade Brasileira de Ciência em Animais de Laboratório (SBCAL). Ex-coordenadora do Conselho Nacional de Controle da Experimentação Animal (CONCEA).",
      contact: {
        email: "lgmacedo@gmail.com",
        linkedin: "https://www.linkedin.com/in/luisa-maria-gomes-de-macedo-braga-8b2b1150",
        instagram: "luisamgmb",
        lattes: "http://lattes.cnpq.br/1415840218265113"
      }
    },
    {
      name: "Jivago Rôlo",
      role: "Sócio Proprietário",
      image: "/jivago-rolo.jpg",
      bio: "Médico-veterinário e cientista com mestrado e doutorado em Biologia Animal e especializado em Ciência de Animais de Laboratório, FELASA SPECIALIST D. Atua na interface entre bem-estar animal, ética em pesquisa e desenho experimental aplicado à biomedicina. Tem experiência em gestão e modernização de biotérios acadêmicos e implementação de rotinas de biossegurança.",
      contact: {
        email: "jivagorolo@gmail.com",
        linkedin: "https://www.linkedin.com/in/jivago-rolo",
        lattes: "http://lattes.cnpq.br/0401207763557481"
      }
    },
    {
      name: "Marta Lorena Speck da Silva",
      role: "Sócia Proprietária",
      image: "/marta-speck.jpg",
      bio: "Graduada em Ciências Biológicas com ênfase em Biopatologia e mestre em Ciências Farmacêuticas pela UFRGS. Doutoranda em Medicina Translacional pela UFC. Acadêmica Titular da ABCAL. Atuação em gestão da qualidade para biotérios e monitoramento sanitário. Foi responsável pela implementação dos padrões AAALAC no biotério da UFC.",
      contact: {
        email: "martaspeck@gmail.com",
        linkedin: "https://www.linkedin.com/in/marta-speck-b987b9139/",
        lattes: "http://lattes.cnpq.br/7259678197876031"
      }
    }
  ];

  const consultants = [
    {
      name: "Ekaterina Akimovna Botovchenco Rivera",
      role: "Consultora Sênior",
      image: ekaterinaImage,
      highlight: true,
      bio: "Possui graduação em Medicina Veterinária pela Faculdade de Agronomia e de Veterinária da Universidade Federal do Rio Grande do Sul (1967), mestrado em Laboratory Animal Science pelo The Royal Veterinary College, University of London (1989). Doutorado cursado em 1994/95 e Título de Doutora Notório Saber conferido pela UFG (2017). Pesquisadora Emérita CNPq 2019. Premio Internacional Charles River 2020. Coordenadora do Concea (2020-2022). Membro titular do CONCEA pelo CNPq (2018-2020). Homenagem Especial do Concea 2023. Coordenadora do Biotério Central da UFG de 1979 a 2014. Membro do grupo de consultores ad hoc em bem-estar de animais de laboratório da OIE-OMSA.",
      contact: {
        lattes: "http://lattes.cnpq.br/" // Placeholder if not provided, removed from display if empty
      }
    },
    {
      name: "Patrícia Silva",
      role: "Especialista em Gestão da Qualidade",
      image: patriciaImage,
      highlight: false,
      bio: "Profissional sênior com mais de 20 anos de experiência em Gestão da Qualidade, Sistemas de Gestão Integrados e Melhoria Contínua. Especialista na implantação, manutenção e auditoria de Sistemas de Gestão (ISO 9001, ISO 14001 e ISO 45001) além tecnica da ISO IEC 17025. Atuação estratégica em projetos Lean Six Sigma, com foco em processos administrativos e de serviços.",
      contact: {
        email: "paricia_mp_silva@hotmail.com",
        linkedin: "https://www.linkedin.com/in/patty-silva"
      }
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Equipe</h1>
            <p className="text-xl opacity-90">
              Liderança experiente e consultoria especializada
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-primary border-b pb-2 text-center">Sócios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-40 h-40 bg-secondary/10 rounded-full flex items-center justify-center overflow-hidden mb-6 border-4 border-white shadow-md">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-16 h-16 text-secondary" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-secondary font-semibold mb-4 min-h-[3rem]">{member.role}</p>
                  <p className="text-muted-foreground text-sm text-justify mb-6">{member.bio}</p>

                  <div className="mt-auto pt-4 border-t w-full flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                    {/* Contacts simplified for grid view */}
                    {member.contact.linkedin && (
                      <a href={member.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        LinkedIn
                      </a>
                    )}
                    {member.contact.lattes && (
                      <a href={member.contact.lattes} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Lattes
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-primary border-b pb-2 text-center">Consultores Associados</h2>
          <div className="max-w-5xl mx-auto space-y-12">
            {consultants.map((member, index) => (
              <Card key={index} className={`overflow-hidden ${member.highlight ? 'border-secondary/50 border-2 shadow-xl' : ''}`}>
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-64 md:h-auto relative">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top absolute inset-0" />
                    </div>
                    <div className="p-8 md:w-2/3">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                        <div>
                          <h3 className="text-2xl font-bold">{member.name}</h3>
                          <p className={`font-semibold ${member.highlight ? 'text-secondary text-lg' : 'text-muted-foreground'}`}>
                            {member.role}
                          </p>
                        </div>
                        {member.highlight && (
                          <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            Destaque
                          </span>
                        )}
                      </div>

                      <p className="text-muted-foreground text-justify mb-6">{member.bio}</p>

                      <div className="flex gap-4 text-sm">
                        {member.contact?.email && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            ✉️ {member.contact.email}
                          </span>
                        )}
                        {member.contact?.linkedin && (
                          <a href={member.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                            🔗 LinkedIn
                          </a>
                        )}
                        {member.contact?.lattes && member.contact.lattes.length > 25 && (
                          <a href={member.contact.lattes} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                            📄 Lattes
                          </a>
                        )}
                      </div>
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
