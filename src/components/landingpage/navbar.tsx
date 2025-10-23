'use client';

import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import Image from 'next/image';

const LINK_CLASSES = "text-gray-700 hover:!text-warning-300 dark:text-gray-200 dark:hover:!text-warning-300 transition-colors duration-150";

export default function NavbarComponent() { 
  return (
    <div className="w-full fixed top-0 z-50 border-b-1 border-warning-400 bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
      <Navbar fluid={true} rounded>
        <NavbarBrand href="/">
          {/* <Image
            src="/hivehub-icon.png"
            width={37}
          height={37}
          className="mr-3 md:ml-15 h-6 sm:h-9" 
          alt="HiveHub Logo" 
        /> */}
        {/* <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">HiveHub</span> */}

        <Image src={"/HiveHub-logopreto.png"}
        alt="logo Hive Hub"
        width={200}
        height={200}
        className="block dark:hidden h-12 w-28 mr-3"  
      />
      
      <Image src={"/HiveHub-logobranca.png"}
        alt="logo Hive Hub"
        width={200}
        height={200}
        className="hidden dark:block h-12 w-28 mr-3"  
      />
        
      </NavbarBrand>
      
      <div className="flex md:order-2 md:mr-15 gap-4 items-center">
        <div className="hidden md:flex gap-6 items-center">
          <a href="#home" className={LINK_CLASSES}>Home</a>
          <a href="#sobrenos" className={LINK_CLASSES}>Sobre</a>
          <a href="#desafios" className={LINK_CLASSES}>Desafios</a>
          <a href="#footer" className={`${LINK_CLASSES} border-2 border-warning-400 rounded-lg px-4 py-2`}>Contato</a>
        </div>
        <Button href="/signin" className="bg-warning-500 dark:bg-warning-500 text-white px-6 py-5.5 hover:bg-warning-600 dark:hover:bg-warning-600 transition focus:outline-none focus:ring-1 focus:ring-warning-300 focus:ring-offset-1 ">Entrar</Button>
        <NavbarToggle />
      </div>
      
      <NavbarCollapse className="md:hidden">
        <NavbarLink href="#home" className={`${LINK_CLASSES} hover:!bg-transparent dark:hover:!bg-transparent`}>
          Home
        </NavbarLink>
        <NavbarLink href="#sobrenos" className={`${LINK_CLASSES} hover:!bg-transparent dark:hover:!bg-transparent`}>
          Sobre
        </NavbarLink>
        <NavbarLink href="#desafios" className={`${LINK_CLASSES} hover:!bg-transparent dark:hover:!bg-transparent`}>
          Desafios
        </NavbarLink>
        <NavbarLink href="#footer" className={`${LINK_CLASSES} hover:!bg-transparent dark:hover:!bg-transparent border-2 border-warning-400 rounded-lg`}>
          Contato
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  </div>
  );
}