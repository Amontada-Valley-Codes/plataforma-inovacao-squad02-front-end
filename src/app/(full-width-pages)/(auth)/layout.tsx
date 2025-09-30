import { Toaster } from 'sonner';
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <div className="flex min-h-svh w-full bg-[url('/fachada-Copy.jpeg')]  backdrop-blur-lg bg-cover bg-center bg-no-repeat items-center justify-center p-6 md:p-10">
    <Toaster position="top-center" richColors />
     <div className="w-full max-w-sm ">
        {children}
      </div>
    </div>
  );
}
