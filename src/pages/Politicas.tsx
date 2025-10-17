import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Politicas = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Políticas e Termos</h1>
            <p className="text-xl opacity-90">
              Transparência e conformidade em todas as nossas práticas
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6">Política de Privacidade</h2>
              <p className="text-muted-foreground mb-6">
                Última atualização: Janeiro de 2025
              </p>

              <div className="space-y-6 text-muted-foreground">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">1. Informações que Coletamos</h3>
                  <p className="mb-2">
                    A Vivens Consultoria coleta informações que você nos fornece diretamente ao:
                  </p>
                  <ul className="space-y-1 ml-6">
                    <li>• Preencher formulários de contato em nosso website</li>
                    <li>• Solicitar orçamentos ou informações sobre nossos serviços</li>
                    <li>• Inscrever-se em nossa newsletter</li>
                    <li>• Participar de eventos ou treinamentos</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">2. Como Usamos suas Informações</h3>
                  <p className="mb-2">
                    Utilizamos as informações coletadas para:
                  </p>
                  <ul className="space-y-1 ml-6">
                    <li>• Responder às suas solicitações e fornecer informações sobre nossos serviços</li>
                    <li>• Enviar comunicações relacionadas aos serviços contratados</li>
                    <li>• Melhorar nossos serviços e experiência do usuário</li>
                    <li>• Enviar newsletters e conteúdos relevantes (mediante consentimento)</li>
                    <li>• Cumprir obrigações legais e regulatórias</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">3. Proteção de Dados</h3>
                  <p>
                    Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger 
                    suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. 
                    Seus dados são armazenados em servidores seguros e acessados apenas por pessoal autorizado.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">4. Compartilhamento de Informações</h3>
                  <p>
                    Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para 
                    fins de marketing. Podemos compartilhar informações apenas quando:
                  </p>
                  <ul className="space-y-1 ml-6 mt-2">
                    <li>• Necessário para prestação de serviços contratados</li>
                    <li>• Exigido por lei ou ordem judicial</li>
                    <li>• Com seu consentimento explícito</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">5. Seus Direitos (LGPD)</h3>
                  <p className="mb-2">
                    De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
                  </p>
                  <ul className="space-y-1 ml-6">
                    <li>• Confirmar a existência de tratamento de seus dados</li>
                    <li>• Acessar seus dados pessoais</li>
                    <li>• Corrigir dados incompletos, inexatos ou desatualizados</li>
                    <li>• Solicitar a anonimização, bloqueio ou eliminação de dados</li>
                    <li>• Revogar o consentimento a qualquer momento</li>
                    <li>• Obter informações sobre compartilhamento de dados</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">6. Cookies</h3>
                  <p>
                    Nosso website pode utilizar cookies para melhorar sua experiência de navegação. 
                    Você pode configurar seu navegador para recusar cookies, mas isso pode afetar 
                    algumas funcionalidades do site.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">7. Contato</h3>
                  <p>
                    Para exercer seus direitos ou esclarecer dúvidas sobre nossa política de privacidade, 
                    entre em contato através do e-mail: <strong>vivensconsultoria@gmail.com</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <Card>
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6">Termos de Uso</h2>
              
              <div className="space-y-6 text-muted-foreground">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">1. Aceitação dos Termos</h3>
                  <p>
                    Ao acessar e utilizar o website da Vivens Consultoria, você concorda em cumprir 
                    estes termos de uso. Se não concordar com qualquer parte destes termos, não utilize nosso website.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">2. Uso do Website</h3>
                  <p className="mb-2">
                    Você concorda em utilizar nosso website apenas para fins legítimos e de acordo com estes termos. 
                    É proibido:
                  </p>
                  <ul className="space-y-1 ml-6">
                    <li>• Usar o site de forma que viole leis ou regulamentos</li>
                    <li>• Transmitir material ofensivo, difamatório ou ilegal</li>
                    <li>• Tentar obter acesso não autorizado a sistemas ou dados</li>
                    <li>• Interferir no funcionamento adequado do website</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">3. Propriedade Intelectual</h3>
                  <p>
                    Todo o conteúdo do website, incluindo textos, gráficos, logos, imagens e software, 
                    é propriedade da Vivens Consultoria e está protegido por leis de direitos autorais. 
                    É proibida a reprodução sem autorização prévia por escrito.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">4. Limitação de Responsabilidade</h3>
                  <p>
                    As informações fornecidas neste website são apenas para fins informativos. 
                    A Vivens não se responsabiliza por decisões tomadas com base nas informações aqui contidas. 
                    Para orientações específicas sobre seu projeto, consulte nossos especialistas.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">5. Modificações</h3>
                  <p>
                    Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                    Alterações entrarão em vigor imediatamente após publicação no website. 
                    O uso continuado do site após modificações constitui aceitação dos novos termos.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">6. Lei Aplicável</h3>
                  <p>
                    Estes termos são regidos pelas leis da República Federativa do Brasil. 
                    Quaisquer disputas serão resolvidas nos tribunais competentes do Brasil.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <Card className="bg-muted/30">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6">Conformidade Regulatória</h2>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  A Vivens Consultoria está comprometida com a conformidade total às regulamentações 
                  nacionais e internacionais aplicáveis à pesquisa pré-clínica:
                </p>
                <ul className="space-y-2 ml-6">
                  <li>
                    <strong className="text-foreground">CONCEA:</strong> Todas as nossas atividades seguem as 
                    diretrizes do Conselho Nacional de Controle de Experimentação Animal
                  </li>
                  <li>
                    <strong className="text-foreground">Lei Arouca (11.794/2008):</strong> Cumprimento integral 
                    da legislação brasileira sobre uso científico de animais
                  </li>
                  <li>
                    <strong className="text-foreground">ANVISA:</strong> Conformidade com as normas da Agência 
                    Nacional de Vigilância Sanitária
                  </li>
                  <li>
                    <strong className="text-foreground">GLP:</strong> Implementação de Boas Práticas de Laboratório 
                    conforme padrões nacionais e internacionais
                  </li>
                  <li>
                    <strong className="text-foreground">OECD Guidelines:</strong> Adoção de diretrizes da 
                    Organização para a Cooperação e Desenvolvimento Econômico
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Politicas;
