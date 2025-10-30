"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import api from "@/services/axiosServices";

interface Company {
  name: string;
  totalUsers: number;
  activeChallenges: number;
  completedChallenges: number;
}

interface CompanyResponse {
  data: Company[];
  total: number;
  page: number;
  limit: number;
}

export default function ListCompany() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<CompanyResponse>("/dashboard/companies", {
        params: { page: currentPage, limit },
        headers: { accept: "application/json" },
      });

      setCompanies(data.data);
      setTotalPages(Math.ceil(data.total / data.limit || 1));
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao buscar empresas");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border-1 border-l-4 border-[#fb6514] bg-white px-4 pb-3 pt-4 shadow-lg dark:border-[#fb6514] dark:bg-gray-900 sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#fb6514]">Lista de Empresas</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Visão geral das Empresas
          </p>
        </div>
      </div>

      {loading && <p className="text-gray-500 text-sm">Carregando empresas...</p>}
      {error && <p className="text-red-500 text-sm">Erro: {error}</p>}

      {!loading && !error && (
        <>
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-y border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/50">
                <TableRow>
                  <TableCell
                    isHeader
                    className="py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300"
                  >
                    Empresa
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300"
                  >
                    Usuários
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300"
                  >
                    Desafios Ativos
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300"
                  >
                    Desafios Concluídos
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {companies.map((company, index) => (
                  <TableRow
                    key={index}
                    className="transition-colors duration-150 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="py-3">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {company.name}
                      </p>
                    </TableCell>
                    <TableCell className="py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                      {company.totalUsers}
                    </TableCell>
                    <TableCell className="py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                      {company.activeChallenges}
                    </TableCell>
                    <TableCell className="py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          company.completedChallenges > 0
                            ? "bg-[#fb6514]/20 text-[#fb6514] ring-1 ring-inset ring-[#fb6514]/60"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {company.completedChallenges}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center gap-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, idx) => (
                    <PaginationItem key={idx}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === idx + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(idx + 1);
                        }}
                      >
                        {idx + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Página {currentPage} de {totalPages}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
