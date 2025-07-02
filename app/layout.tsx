import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import "./globals.css";
import { SettingsProvider } from "./contexts/settings";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SudokuByAech",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <SettingsProvider>
          <SidebarProvider className={`${inter.variable} ${playfair.variable}`}>
            <div className="flex w-full h-screen">
              <AppSidebar />
              <main className="flex-1 w-full h-screen">{children}</main>
            </div>
          </SidebarProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
