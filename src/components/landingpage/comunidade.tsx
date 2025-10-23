
export default function comunidade() {
  return (
    <div className="relative bg-cover bg-center h-screen flex items-center justify-center"
      style={{ backgroundImage: "url('/imagempessoas.png')" }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 text-white max-w-7xl mx-auto p-8 flex flex-col items-center md:flex-row md:items-center md:text-left">
        <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl text-white font-bold mb-4">
              Faça parte da Comunidade de Inovação mais vibrante do Brasil!
            </h1>
            <p className="text-base text-white md:text-xl mb-4">
              Na HiveHub, você transforma desafios em execução rápida.
            </p>
            <p className="text-base text-white md:text-xl mb-4">
              Reunimos líderes, startups e talentos em um ecossistema que move suas ideias do papel à Prova de Conceito (PoC) em tempo recorde. Não apenas inove, redefina o futuro conosco.
            </p>
        </div>
      </div>
    </div>
  );
}