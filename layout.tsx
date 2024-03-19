import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider} from "@/context/context"
import MainHeader from '@/components/ui/header'

const inter = Inter({ subsets: ["latin"], display: 'swap', variable: '--font-inter' });

export const metadata: Metadata = {
  title: "Boonties",
  description: "Cardano Bounty Board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <MainHeader />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}