'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/app/components/auth/AuthContext";
import Navigation from "@/app/components/layout/Navigation";
import Footer from "@/app/components/layout/Footer";
import FloatingMessageButton from "@/app/components/messaging/FloatingMessageButton";
import { usePathname } from "next/navigation";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === '/messaging';

  return (
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
      <AuthProvider>
        {!hideLayout && <Navigation />}
        <main className={`flex-grow ${hideLayout ? '' : 'pt-20'}`}>
          {children}
        </main>
        {!hideLayout && <FloatingMessageButton />}
        {!hideLayout && <Footer />}
      </AuthProvider>
    </body>
  );
}