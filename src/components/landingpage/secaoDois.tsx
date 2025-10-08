import Image from "next/image";

export default function secaoDois() {
  return (
    <div className="flex items-center justify-between">     
      <div className="max-w-7xl md:my-10 mx-auto p-8 md:gap-25 flex flex-col items-center md:flex-row md:items-center md:text-left">            
        <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Transforme a <span className="text-warning-500">visão interna</span> em vantagem competitiva. 
            </h1>
            <p className="text-base md:text-xl mb-4">
              A maior fonte de inovação da sua empresa está na visão inexplorada dos seus colaboradores. Em vez de buscar soluções externas, o HiveHub permite que você lance desafios estratégicos e mobilize as mentes mais brilhantes da sua equipe. Criamos o ambiente ideal para que o conhecimento interno se transforme em vantagem competitiva real.
            </p>
        </div>
        <div className="md:w-1/2 flex items-center md:justify-start">
            <Image 
              src="/ilustracaovetor.png" 
              width={500} 
              height={128} 
              alt="Imagem principal" 
              className="rounded-2xl w-full max-w-sm md:max-w-md h-auto" 
            />
        </div>
      </div>
    </div>
  );
}