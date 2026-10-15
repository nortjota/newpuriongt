import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PurionProvider } from "@/lib/store/PurionProvider";
import Toast from "@/components/widgets/Toast";
import WhatsAppFab from "@/components/widgets/WhatsAppFab";
import QuizTab from "@/components/widgets/QuizTab";
import EmailCaptureModal from "@/components/widgets/EmailCaptureModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PURION GT — Perfume automotivo de alta performance",
  description:
    "PURION GT é um auto parfum premium feito para o interior do seu carro. Notas reais, fixação longa, presença discreta.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PurionProvider>
          {children}
          <Toast />
          <QuizTab />
          <WhatsAppFab />
          <EmailCaptureModal />
        </PurionProvider>
      </body>
    </html>
  );
}
