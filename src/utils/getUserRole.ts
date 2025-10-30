import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  id: string;
  email: string;
  role: "ADMIN" | "COMMON" | "EVALUATOR" | "MANAGER" | 'STARTUP'; 
}

export function getUserRole(): TokenPayload["role"] | null {
  if (typeof window === "undefined") return null; 
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.role;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
}
