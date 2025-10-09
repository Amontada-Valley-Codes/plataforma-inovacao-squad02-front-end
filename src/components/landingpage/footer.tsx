import Image from "next/image";
import { FaWhatsapp, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa6";   
import { BsTwitterX } from "react-icons/bs";


export default function Footer() {
  return (
    <footer className="bg-gray-800 text-center flex md:flex-col flex-col text-white md:px-50 py-20">
      <div className="flex flex-col content-start items-center md:flex-row md:text-left justify-between w-full">
        <div className="flex flex-col w-80">
            <h3 className="mb-4 text-2xl">
                Plataforma de Inovação Aberta Corporativa
            </h3>
            <p>
                Ponte digital que conecta grandes empresas a soluções internas e externas (como ideias de colaboradores e startups), gerenciando todo o processo de inovação por meio de um funil estruturado.
            </p>
        </div>
        <div className="flex flex-col mt-5">
            <h3 className=" text-2xl">
                Links Rápidos
            </h3>
            <div>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#desafios">Desafios</a></li>
                    <li><a href="#sobrenos">Sobre</a></li>
                    <li><a href="#footer">Contato</a></li>
                </ul>
            </div>
        </div>

        <div className="flex flex-col items-center">
            <Image 
              src="/HiveHub-logobranca.png" 
              width={400}
              height={128} 
              alt="Imagem Logo" 
              className="w-80" 
            />
            <div className="">
            <h4 className="mb-2">Entre em contato:</h4>
              <div className="flex flex-row justify-center">
                <a href="#" className="transition-all duration-300 transform hover:scale-140 mr-3 hover:text-warning-300"><FaWhatsapp size={25} /></a>
                <a href="#" className="transition-all duration-300 transform hover:scale-140 mr-3 hover:text-warning-300"><FaFacebook size={25} /></a>
                <a href="#" className="transition-all duration-300 transform hover:scale-140 mr-3 hover:text-warning-300"><FaInstagram size={27} /></a>
                <a href="#" className="transition-all duration-300 transform hover:scale-140 mr-3 hover:text-warning-300"><FaLinkedin size={25} /></a>
                <a href="#" className="transition-all duration-300 transform hover:scale-140 mr-3 hover:text-warning-300"><BsTwitterX size={24} /></a>
            </div>  
        </div>
        </div>
      </div>
        <div className="max-w-7xl border-t-2 border-white mt-30 mx-auto w-full md:p-10 px-4">
          <p className="text-center">
         &copy; {new Date().getFullYear()} HivHub. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
