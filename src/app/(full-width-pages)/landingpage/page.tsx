import Carrossel from "@/components/landingpage/carrossel";
import Desafios from "@/components/landingpage/desafios";
import Home from "@/components/landingpage/home";
import Navbar from "@/components/landingpage/navbar";
import Secao from "@/components/landingpage/sobrenos";
import SecaoDois from "@/components/landingpage/secaoDois";
import Footer from "@/components/landingpage/footer";
import Comunidade from "@/components/landingpage/comunidade";


export default function LandingPage() {
  return (
    <main className="m-0 p-0"> 
      <Navbar />    
      <div className="p-0 m-0">
        <section id="home">
            <Home />
        </section>
        <section id="#sobrenos"> 
            <Secao />
        </section>
            <Carrossel />
        <section id="desafios"> 
            <Desafios />
        </section>
        <section id="secaoDois">
            <SecaoDois />
        </section>
        <section>
          <Comunidade />
        </section>
        <section id="footer">
            <Footer />
        </section>
      </div>
    </main>
  );
}