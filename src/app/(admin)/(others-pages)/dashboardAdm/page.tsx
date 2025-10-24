import type { Metadata } from "next";
import React from "react";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import ListCompany from "@/components/screemAdm/ListCompany";
import { CardsAdm } from "@/components/screemAdm/CardsAdm";
import FunnelCategory from "@/components/screemAdm/FunnerCategories";

export const metadata: Metadata = {
  title: "Hive Hub | Colmeia de ideias",
  description: "Plataforma de inovações",
  icons: {
    icon: "hivehub-icon.png",
  },
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <CardsAdm />
        <FunnelCategory />
      </div>

      {/* <div className="col-span-12">
        <StatisticsChart />
      </div> */}

      <div className="col-span-12 xl:col-span-12">
        <ListCompany />
      </div>
    </div>
  );
}
