export default function sobrenos() {
  return (
    <div 
      className="relative bg-cover bg-center h-screen flex items-center justify-center"
      style={{ backgroundImage: "url('/apertodemao.jpg')" }}
    >    
      <div className="absolute w-full inset-0 bg-black opacity-80"></div>
      <div className="relative z-10 text-white max-w-7xl mx-auto p-8 flex flex-col items-center md:flex-row md:items-center md:text-left">
        <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Nossa Proposta de Valor 
            </h1>
            <p className="text-base md:text-xl mb-4">
              Sua Plataforma é a ponte entre os desafios do seu negócio e as soluções mais disruptivas do mercado. Oferecemos uma solução completa para a gestão do ciclo de inovação, desde a ideação até a experimentação de projetos (PoCs).
            </p>
            <p className="text-base md:text-xl">
              Para empresas que buscam modernizar seus processos, captar ideias de forma estruturada e se conectar com parceiros estratégicos, nossa plataforma oferece um ambiente dinâmico e inteligente, focado em resultados tangíveis.
            </p>
        </div>
      </div>
    </div>
  );
}