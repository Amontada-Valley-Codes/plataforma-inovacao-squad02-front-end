import type { Metadata } from "next";
import React from "react";
import CardsUser from "@/components/screemUser/CardsUser";
import RecentMatchesList from "@/components/screemUser/RecentMatchesList";

export const metadata: Metadata = {
  title: "Hive Hub | Colmeia de ideias",
  description: "Plataforma de inovações",
  icons: {
    icon: "hivehub-icon.png",
  },
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 lg:gap-8">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <CardsUser />
        <RecentMatchesList />
      </div>

      <div className="col-span-12 xl:col-span-12">
        {/* <ListCompany /> */}
      </div>
    </div>
  );
}
