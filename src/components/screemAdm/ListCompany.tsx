"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Company {
  name: string;
  totalUsers: number;
  activeChallenges: number;
  completedChallenges: number;
}

export default function ListCompany() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const { data } = await axios.get(
          "https://loyal-cooperation-production.up.railway.app/dashboard/companies",
          {
            params: { page: 1, limit: 10 },
            headers: { accept: "application/json" },
          }
        );

        setCompanies(data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao buscar empresas");
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border-1 border-l-4 border-[#fb6514] bg-white px-4 pb-3 pt-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:px-6">
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
      )}
    </div>
  );
}
