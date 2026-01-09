import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-lab.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(26, 60, 91, 0.95), rgba(26, 60, 91, 0.7)), url(${heroImage})`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10 flex justify-center">
        <div className="max-w-4xl text-white text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Vida Valorizada,<br />Ciência Avançada
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Apoiamos instituições a alcançar preparação para acreditações em biotérios, fortalecendo qualidade, 3Rs/cultura de cuidado e formação de equipes com abordagem prática e institucional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cta" size="xl" asChild>
              <Link to="/contato">
                Solicitar Orçamento <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild className="bg-white/10 backdrop-blur border-white text-white hover:bg-white hover:text-primary">
              <Link to="/sobre">
                Conheça a Vivens
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
