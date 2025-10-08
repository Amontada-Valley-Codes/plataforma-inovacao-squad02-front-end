import Image from 'next/image';

const logos = [
  { src: '/hivehub-icon.png', alt: 'Logo Parceiro 1' },
  { src: '/hivehub-icon.png', alt: 'Logo Parceiro 2' },
  { src: '/hivehub-icon.png', alt: 'Logo Parceiro 3' },
  { src: '/hivehub-icon.png', alt: 'Logo Parceiro 4' },
  { src: '/hivehub-icon.png', alt: 'Logo Parceiro 5' },
  { src: '/hivehub-icon.png', alt: 'Logo Parceiro 6' },
];

const doubledLogos = [...logos, ...logos];

export default function Carrossel() {
  return (
    <section className="py-12 dark:bg-gray-800 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-8">
            <h2 className="font-semibold text-2xl md:text-4xl">
              Parceiros que <span className="text-warning-500">Confiam</span> em Nós
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-base md:text-xl">
              Faça parte desse time também, traga a sua <span className="text-warning-500 font-bold">startup e suas ideias de inovações.</span>
            </p>
        </div>
        <div className="w-full h-24 relative">
            <div className="flex absolute w-[200%] h-full animate-scroll">             
                {doubledLogos.map((logo, index) => (
                    <div 
                        key={index} 
                        className="flex-shrink-0 w-40 h-full flex items-center justify-center mx-4"
                    >
                        <Image 
                            src={logo.src} 
                            alt={logo.alt} 
                            width={120} 
                            height={60}
                            className="w-auto h-12 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
        </div>        
      </div>
    </section>
  );
}