import { Toaster } from "sonner";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900">
      <Toaster position="top-center" richColors />
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen">  
        <div className="flex items-center justify-center ">
          {children}
        </div>

        {/* Lado direito - imagem */}
        <div className="hidden md:flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <Image
            src="/HHbackdrop.webp" 
            alt="Imagem login"
            width={2000}
            height={2000}
            className="object-cover w-full h-screen"
          />
        </div>
      </div>
    </div>
  );
}
