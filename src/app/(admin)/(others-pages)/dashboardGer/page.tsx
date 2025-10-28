import type { Metadata } from "next";
import React from "react";
import FunnelStatusChart from "@/components/screemGer/FunnelStatusChart";
import CardsGer from "@/components/screemGer/CardsGer";
import DesafiosEncerrando from "@/components/screemGer/DesafiosEncerrado";

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
        <CardsGer />
        <FunnelStatusChart />
      </div>

      <div className="col-span-12 xl:col-span-12">
        <DesafiosEncerrando />
      </div>
    </div>
  );
}
