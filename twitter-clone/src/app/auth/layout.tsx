import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-sky-600 font-[Work_Sans]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        {children}
      </div>
    </main>
  );
}
