import { useState, useCallback, useEffect } from "react";
import api from "@/services/axiosServices";
import { Startup, StartupResponse } from "@/types/startup";
import {
  segmentTranslations,
  technologyTranslations,
  stageTranslations
} from "@/constants/startup";

export const useStartups = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchStartups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<StartupResponse>("/startup", {
        params: {
          page: currentPage,
          limit: 9,
        },
      });

      const translatedData = res.data.data.map((startup: any) => ({
        ...startup,
        segment: Array.isArray(startup.segment)
          ? startup.segment.map(
              (seg: string) => segmentTranslations[seg] || seg
            )
          : [segmentTranslations[startup.segment] || startup.segment],
        technologies: Array.isArray(startup.technologies)
          ? startup.technologies.map(
              (tech: string) => technologyTranslations[tech] || tech
            )
          : [
              technologyTranslations[startup.technologies] ||
                startup.technologies,
            ],
            stage: stageTranslations[startup.stage] || startup.stage,
      }));

      setStartups(translatedData);
      setTotalPages(Math.ceil(res.data.total / res.data.limit));
    } catch (err) {
      console.error("Erro ao buscar startups:", err);
      setError("Erro ao carregar startups. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchStartups();
  }, [fetchStartups]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    startups,
    loading,
    error,
    totalPages,
    currentPage,
    fetchStartups,
    handlePageChange,
  };
};
