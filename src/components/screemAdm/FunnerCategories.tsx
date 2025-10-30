"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/axiosServices";

const HIGHLIGHT_COLOR = "#fb6514";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MonthlyData {
  month: number;
  monthName: string;
  totalChallenges: number;
}

interface TimelineResponse {
  year: number;
  totalChallenges: number;
  monthly: MonthlyData[];
}

export default function FunnelCategory() {
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const [series, setSeries] = useState([
    { name: "Desafios Lançados", data: Array(12).fill(0) },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token ausente. Faça login para carregar os dados.");
        }

        const res = await api.get<TimelineResponse>(
          `/dashboard/challenges/timeline?year=${currentYear}`
        );

        const { monthly } = res.data;
        const sorted = [...monthly].sort((a, b) => a.month - b.month);
        const monthlyTotals = sorted.map((m) => m.totalChallenges);

        setSeries([{ name: "Desafios Lançados", data: monthlyTotals }]);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          setError("Sessão expirada. Faça login novamente.");
          setTimeout(() => router.push("/login"), 2000);
        } else if (err.response?.status === 500) {
          setError("Erro interno no servidor. Tente novamente mais tarde.");
        } else {
          setError(err.message || "Erro ao carregar dados do gráfico.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [currentYear, router]);

  const options: ApexOptions = {
    colors: [HIGHLIGHT_COLOR],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: { title: { text: undefined } },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: { formatter: (val: number) => `${val} desafios` },
    },
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">
          Carregando dados do gráfico...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-300 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/10">
        <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border-1 border-l-4 border-[#fb6514] bg-white px-5 pt-5 dark:[#fb6514] dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Desafios Lançados ({currentYear})
        </h3>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={180}
          />
        </div>
      </div>
    </div>
  );
}
