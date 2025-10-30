import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(3, "Digite o nome da Startup"),
  cnpj: z.string().min(18, "CNPJ inválido"),
  segment: z
    .array(
      z.enum([
        "HEALTH",
        "EDUCATION",
        "AGRITECH",
        "INDUSTRY",
        "ENERGY",
        "MARKETING",
        "TRANSPORT",
        "ENVIRONMENT",
        "CYBERSECURITY",
        "AI",
      ])
    )
    .min(1, "Selecione pelo menos um Seguimento"),
  technologies: z
    .array(z.enum(["AI", "MOBILE", "WEB3", "BLOCKCHAIN", "IOT"]))
    .min(1, "Selecione pelo menos uma tecnologia"),
  stage: z.enum(["IDEATION", "OPERATION", "TRACTION", "SCALE"]),
  problems: z.string().min(5, "Descreva melhor o problema"),
  location: z.string().min(2, "Digite uma localização válida"),
  founders: z.array(z.string().min(1, "Nome do fundador é obrigatório")),
  pitch: z.string().min(5, "Descreva melhor o pitch"),
  links: z.array(z.string().min(1, "Link é obrigatório")),
  userEmail:z.string().min(5, "email com mais de 5 caracteres"),
  userPhone:z.string().min(14, "Numero de telefone Incorreto")
});

export type FormData = z.infer<typeof formSchema>;

export type Startup = FormData & {
  id: string;
  createdAt: string;
};

export type StartupResponse = {
  data: Startup[];
  total: number;
  page: number;
  limit: number;
};
