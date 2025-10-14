"use client";

import Image from "next/image"
import { useState } from "react";
import SearchBar from "@/components/ui/Searchbar";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import PubliCard from "@/components/public-page/public-card";

// 🔹 Definindo o tipo correto de Card
interface CardData {
  title: string;
  description: string;
  stats: "ativo" | "fechado";
  dateInicial: string;
  datefinal: string;
  empresa: string;
}

export default function Page(){

  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Lista de cards com tipo aplicado
  const cards: CardData[] = [
    {
      title: "Automaçâo de Processos internos",
      description: "Buscando inovaçoes para automatizar processo manuais porque eu quero ver coisas novas",
      stats: "ativo",
      dateInicial: "13/06/2034",
      datefinal: "12/21/2121",
      empresa: "Amontada Valley"
    },
    {
      title: "Gestão Inteligente de Dados",
      description: "Procurando formas criativas de organizar grandes volumes de informação legais e bonitas para ter jeito Procurando formas criativas de organizar grandes volumes de informação legais e bonitas para ter jeito Procurando formas criativas de organizar grandes volumes de informação legais e bonitas para ter jeito Procurando formas criativas de organizar grandes volumes de informação legais e bonitas para ter jeito Procurando formas criativas de organizar grandes volumes de informação legais e bonitas para ter jeito Procurando formas criativas de organizar grandes volumes de informação legais e bonitas para ter jeito Procurando formas criativas de organizar grandes volumes de informação legais e bonitas para ter jeito Procurando formas criativas de organizar grandes volumes de informação legais e bonitas para ter jeito Procurando formas criativas de organizar grandes volumes de informação legais e bonitas para ter jeito Procurando formas criativas de organizar grandes volumes de informação legais e bonitas para ter jeito",
      stats: "ativo",
      dateInicial: "01/01/2035",
      datefinal: "12/12/2135",
      empresa: "Empresa Braga Nunes"
    },
    {
      title: "Sustentabilidade no Setor Industrial",
      description: "Projetos voltados para inovação sustentável para uma ecologia bem inovadora e maneira",
      stats: "fechado",
      dateInicial: "15/02/2034",
      datefinal: "05/05/2130",
      empresa: "Ypê"
    }
  ];

  // 🔹 Filtrar cards pelo título (não mexe em `tipo`)
  const filteredCards = cards.filter(card =>
    card.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return(
    <div>

        <header className="flex min-h-screen items-center justify-center flex-col content-center w-full relative pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
  <div className="flex items-center gap-2 2xsm:gap-3 absolute z-10 right-5 top-[env(safe-area-inset-top)] pt-5">
    <ThemeToggleButton />
  </div>

  <div className="flex-1 flex items-center justify-center flex-col px-4 pt-3">
          
          <Image
            src="/hivehub-logobranca.png"
            alt="Logo Hive Hub"
            width={260}
            height={200}
            className="dark:block hidden w-full max-w-[190px] md:max-w-[300px] h-auto"
          />
          
          {/* Logo para Light Mode */}
          <Image
            src="/hivehub-logopreto.png"
            alt="Logo Hive Hub"
            width={260}
            height={195}
            className="block dark:hidden w-full max-w-[190px] md:max-w-[300px] h-auto"
          />
        </div>

        <h2 className="dark:text-warning-25/80 text-[1.3em] pb-3 font-light italic text-center mt-4">Uma colmeia de ideias</h2>

        <SearchBar onSearch={(query) => setSearchQuery(query)} />

        <div className="flex gap-1 md:gap-5 items-center justify-center flex-wrap pt-4 pb-4 ">
           {filteredCards.length > 0 ? (
    [...filteredCards] // copia
      .sort(() => Math.random() - 0.5) // embaralha
      .slice(0, 3) // pega só 3
      .map((card, index) => (
        <PubliCard
          key={index}
          title={card.title}
          description={card.description}
          stats={card.stats}
          dateInicial={card.dateInicial}
          datefinal={card.datefinal}
          empresa={card.empresa}
        />
      ))
  ) : (
            <p className="text-black">Nenhum desafio encontrado</p>
          )}
        </div>

      </header>

    </div>
  )
}


