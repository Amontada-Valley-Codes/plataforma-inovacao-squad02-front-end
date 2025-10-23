import { FaWhatsapp, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa6";   
import { BsTwitterX } from "react-icons/bs";

export default function Contato() {
  return (

    <div className="flex flex-col items-center mx-auto md:flex-row md:items-start md:justify-between p-4">     
      <div className="flex flex-col items-center text-center md:items-start md:text-left mb-4 md:mb-0">
        <h1 className="font-semibold mb-2">
          Entre em <span className="bg-amber-500 p-0.5 rounded text-white">contato</span> conosco <br className="hidden md:block" />e saiba mais.
        </h1>
        {/* Tem que usar "https://" nos links */}
        <div className="flex flex-row justify-center">
          <a href="#" className="transition-all duration-300 transform hover:scale-140 mr-3 hover:text-warning-300"><FaWhatsapp size={25} /></a>
          <a href="#" className="transition-all duration-300 transform hover:scale-140 mr-3 hover:text-warning-300"><FaFacebook size={25} /></a>
          <a href="#" className="transition-all duration-300 transform hover:scale-140 mr-3 hover:text-warning-300"><FaInstagram size={27} /></a>
          <a href="#" className="transition-all duration-300 transform hover:scale-140 mr-3 hover:text-warning-300"><FaLinkedin size={25} /></a>
          <a href="#" className="transition-all duration-300 transform hover:scale-140 mr-3 hover:text-warning-300"><BsTwitterX size={24} /></a>
        </div>
      </div>     
      <div className="font-semibold text-center md:text-left mt-4 md:mt-0 md:mr-30">
        <p className="text-sm md:text-base">
          <span className="text-warning-500">Juntos, somos mais inovadores.</span> <br /> Compartilhe sua ideia. <br /> Conecte-se. Colabore. Crie.
        </p>
      </div>
    </div>
  );
}
