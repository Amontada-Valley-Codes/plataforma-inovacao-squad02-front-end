

export default function desafios() {
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center px-4">
      <h2 className="font-semibold text-2xl md:text-4xl">Desafios <span className="text-warning-500">Lançados</span></h2>
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-center mt-3 md:mb-15 mb-6 text-base md:text-xl">
         Veja <span className="text-warning-500 font-bold">desafios lançados</span> publicamente por algumas <span className="text-warning-500 font-bold">startups</span> que demandam <span className="text-warning-500 font-bold">soluções inovadoras</span> e estratégicas para o mercado.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-10 items-center">
        <h1 className="bg-gray-600 text-center p-30 rounded-2xl">Card</h1>
        <h1 className="bg-gray-600 text-center p-30 rounded-2xl">Card</h1>
        <h1 className="bg-gray-600 text-center p-30 rounded-2xl">Card</h1>
      </div>
      <div className="my-8 border-b-2 w-full border-warning-500  py-6 flex justify-center">
        <button className="bg-warning-500  hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-warning-400 text-white py-2 px-4 rounded-md mt-4"><a href="/desafios">Ver Mais</a></button>
      </div>
    </div>
  );
}