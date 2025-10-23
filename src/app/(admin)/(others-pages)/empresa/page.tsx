"use client";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextArea from "@/components/form/input/TextArea";
import api from "@/services/axiosServices";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import Cards from "@/components/empresa/Cards";
import Swal from "sweetalert2";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const formSchema = z.object({
  name: z.string().min(2, "digite pelo menos 2 letras"),
  cnpj: z.string().max(18, "cnpj invalido"),
  description: z.string().min(3, "digite pelo menos uma descriçao mais completa"),
  managerEmail: z.string().min(5, "email muito curto"),
  managerPhone: z.string().min(14, "Numero de telefone Incorreto"),
});

type FormData = z.infer<typeof formSchema>;

type Empresa = {
  name: string;
  cnpj: string;
  description: string;
  createdAt: string;
};

export default function Page() {
  const { isOpen, openModal, closeModal } = useModal();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchEmpresas = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/empresas", {
          params: {
            page: currentPage,
            limit: 9,
          },
        });
        
        // Formato da API: { data: [...], meta: { total, page, limit, totalPages } }
        if (res.data.data && res.data.meta) {
          setEmpresas(res.data.data);
          setTotalPages(res.data.meta.totalPages);
          console.log("Empresas carregadas:", res.data.data.length);
          console.log("Total de páginas:", res.data.meta.totalPages);
        } else {
          console.error("Estrutura de resposta inesperada:", res.data);
          setEmpresas([]);
          setTotalPages(1);
        }
        
      } catch (erro) {
        console.error("Erro ao buscar empresas", erro);
        setError("Erro ao carregar empresas.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, [currentPage]);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await api.post("/empresas/with-manager", data);
      const { newCompany, manager } = response.data;
      console.log(response.data.data);

      setEmpresas((prev) => [response.data, ...prev]);
      
      Swal.fire({
        title: "Sucesso!",
        text: "Empresa cadastrada com sucesso!",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          container: "z-[9999]",
        },
      });

      const message =
      `Olá, Você foi convidado para gerenciar a empresa ${newCompany.name}
      .Clique no link abaixo para completar seu cadastro
      ${manager.inviteLink}`;
      const phone = data.managerPhone.replace(/\D/g, "");
      const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, "_blank");
    } catch (error) {
      console.error("erro ao cadastrar", error);
      toast.error("erro no cadastro");
    }

    reset();
    closeModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-center" richColors />
      <div className="flex justify-between">
        <p className="text-2xl">Cadastro de Empresa</p>
        <Button onClick={openModal} size="sm" variant="primary">
          Nova Empresa
        </Button>
      </div>

     

      <div className="mt-6">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        ) : !loading && empresas.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-dashed border-orange-200">
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Nenhuma empresa cadastrada ainda
            </h3>
            <p className="text-gray-500 dark:text-gray-300">
              Comece criando sua primeira empresa!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {empresas.map((empresa, index) => (
                <Cards
                  key={index}
                  name={empresa.name}
                  cnpj={empresa.cnpj}
                  description={empresa.description}
                  createdAt={new Date(empresa.createdAt).toLocaleDateString("pt-BR")}
                />
              ))}
            </div>

           
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) => Math.max(prev - 1, 1));
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, idx) => (
                      <PaginationItem key={idx}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === idx + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(idx + 1);
                          }}
                          className="cursor-pointer"
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
                          setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      <div>
        <Modal isOpen={isOpen} onClose={closeModal}>
          <ComponentCard title="Criar nova empresa">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label>Nome:</Label>
                <Input
                  type="text"
                  placeholder="Digite nome da empresa"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-red-600">{errors.name.message}</span>
                )}
              </div>

              <div>
                <Label>Cnpj</Label>
                <Input
                  type="text"
                  placeholder="XX.XXX.XXX/0001-XX"
                  {...register("cnpj")}
                />
                {errors.cnpj && (
                  <span className="text-red-600">{errors.cnpj.message}</span>
                )}
              </div>

              <div>
                <Label>Telefone</Label>
                <Input
                  type="text"
                  {...register("managerPhone")}
                  placeholder="+5511999998888"
                />
                {errors.managerPhone && (
                  <span className="text-red-600">
                    {errors.managerPhone.message}
                  </span>
                )}
              </div>

              <div>
                <Label>Descriçao</Label>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <TextArea
                      className="text-gray-950"
                      rows={6}
                      placeholder="Digite uma descrição"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.description && (
                  <span className="text-red-600">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div>
                <Label>Email Gerente</Label>
                <Input
                  type="text"
                  placeholder="Digite o email gerente"
                  {...register("managerEmail")}
                />
                {errors.managerEmail && (
                  <span className="text-red-600">
                    {errors.managerEmail.message}
                  </span>
                )}
              </div>

              <div>
                <Button className="w-full mt-2" size="sm">
                  Enviar
                </Button>
              </div>
            </form>
          </ComponentCard>
        </Modal>
      </div>
    </div>
  );
}