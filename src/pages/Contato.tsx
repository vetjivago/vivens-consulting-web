import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contato = () => {

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Entre em Contato</h1>
            <p className="text-xl opacity-90">Estamos prontos para atender suas necessidades</p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-6">Fale Conosco</h2>
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Mail className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:vivensconsultoria@gmail.com" className="text-muted-foreground hover:text-secondary">
                        vivensconsultoria@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Localização</h3>
                      <p className="text-muted-foreground">Brasília, DF - Atuação Nacional</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-6">Solicitar Orçamento</h3>
                <form action="https://formsubmit.co/vivensconsultoria@gmail.com" method="POST" className="space-y-4">
                  <Input name="name" placeholder="Nome" required />
                  <Input name="email" type="email" placeholder="Email" required />
                  <Input name="_subject" placeholder="Assunto" required />
                  <Textarea name="message" placeholder="Mensagem" rows={5} required />

                  {/* FormSubmit Configuration */}
                  <input type="hidden" name="_template" value="table" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_next" value="https://vivenslab.com/contato?success=true" />

                  <Button type="submit" variant="cta" size="lg" className="w-full">Enviar Mensagem</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contato;
