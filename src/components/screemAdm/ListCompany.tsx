import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

// Define a interface TypeScript para as linhas da tabela
interface Product {
  id: number;
  name: string;
  users: string; 
  challengeAtv: string; 
  challengeCpl: number;
}

// Define os dados da tabela usando a interface
const tableData: Product[] = [
  {
    id: 1,
    name: "TechNova",
    users: "10",
    challengeAtv: "5",
    challengeCpl: 3,
  },
  {
    id: 2,
    name: "MasterInove",
    users: "8",
    challengeAtv: "4",
    challengeCpl: 2,
  },
  {
    id: 3,
    name: "HexTech",
    users: "5",
    challengeAtv: "2",
    challengeCpl: 1,
  },
  {
    id: 4,
    name: "Amontar Soluções",
    users: "6",
    challengeAtv: "2",
    challengeCpl: 1,
  },
  {
    id: 5,
    name: "Wappetite",
    users: "1",
    challengeAtv: "1",
    challengeCpl: 1,
  },
];

export default function ListCompany() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {/* APLICAÇÃO DA COR #fb6514 NO TÍTULO (simulando uma cor primária) */}
          <h3 className="text-xl font-bold text-[#fb6514]">
            Lista de Empresas
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Visão geral das Empresas</p>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-y border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/50">
            <TableRow>
              {/* Coluna: Lista de Empresas (name) */}
              <TableCell
                isHeader
                className="py-3 text-start text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300"
              >
                Empresa
              </TableCell>
              {/* Coluna: Usuários (users) - Centralizada */}
              <TableCell
                isHeader
                className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300"
              >
                Usuários
              </TableCell>
              {/* Coluna: Desafios (challengeAtv) - Centralizada */}
              <TableCell
                isHeader
                className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300"
              >
                Desafios Ativos
              </TableCell>
              {/* Coluna: Desafios Concluídos (challengeCpl) - Centralizada */}
              <TableCell
                isHeader
                className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300"
              >
                Desafios Concluídos
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((product) => (
              // Adicionando efeito de hover na linha
              <TableRow key={product.id} className="transition-colors duration-150 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                
                {/* 1. Lista de Empresas (name) */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {product.name}
                      </p>
                    </div>
                  </div>
                </TableCell>
                
                {/* 2. Usuários (users) - Centralizada */}
                <TableCell className="py-3 text-sm text-center text-gray-700 dark:text-gray-300">
                  {product.users}
                </TableCell>
                
                {/* 3. Desafios (challengeAtv) - Centralizada */}
                <TableCell className="py-3 text-sm text-center text-gray-700 dark:text-gray-300">
                  {product.challengeAtv}
                </TableCell>
                
                {/* 4. Desafios Concluídos (challengeCpl) - Centralizada com Badge */}
                <TableCell className="py-3 text-sm text-center text-gray-700 dark:text-gray-300">
                  <div className="flex justify-center">
                    {/* AQUI VOCÊ PODE TER QUE CRIAR UM NOVO TIPO DE 'COLOR' PARA O SEU BADGE */}
                    {/* Se o seu Badge aceita cores personalizadas (ex: "primary" que você mapeia para #fb6514): */}
                    {/* <Badge size="sm" color="primary">{product.challengeCpl}</Badge> */}
                    
                    {/* OU, se você usar a cor diretamente no Badge (apenas se for um Badge customizado): */}
                    <div 
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                        ${product.challengeCpl > 0 
                            ? 'bg-[#fb6514]/20 text-[#fb6514] ring-1 ring-inset ring-[#fb6514]/60' // Usa sua cor de destaque
                            : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400' // Cor neutra se 0
                        }`}
                    >
                        {product.challengeCpl}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}