import Image from "next/image";
import Contato from "./contatoIcon";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center px-4 mt-20 md:mt-0 md:px-0 mx-auto max-w-7xl">
      <div className="md:w-1/2 mx-1 text-center order-1 md:order-1 md:mb-0">
        <h1 className="text-3xl md:text-left font-semibold md:text-5xl lg:text-5xl my-6">Transformamos a inovação em <span className="text-warning-500">resultados indispensáveis</span></h1>
        <p className="text-gray-600 md:text-2xl py-5 text-left md:text-start dark:text-gray-300">A HiveHub é uma plataforma que <span className="text-black font-bold">conecta empresas</span> a soluções inovadoras, impulsionando a <span className="text-black font-bold">transformação digital</span> e o crescimento sustentável.</p>
        <Contato />
      </div>
      <div className="md:w-1/2 mx-auto  md:mx-0 order-1 md:order-2">
        <Image 
          src="/ilustracao.png" 
          alt="Landing Page Image" 
          width={500} 
          height={400} 
          className="w-full h-auto max-w-md lg:max-w-lg mx-auto"
        />
      </div>
    </div>
  );
}