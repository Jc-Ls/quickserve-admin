import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // Importing our new Sidebar!

export const metadata: Metadata = {
  title: "QuickServe Admin | Jare's Choice Labs",
  description: "Global Ecosystem Control Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-qsLight text-qsDark antialiased flex">
        
        {/* The Permanent Sidebar */}
        <Sidebar />

        {/* The Main Content Area (Pushed right by 64 units to make room) */}
        <main className="flex-1 ml-64 min-h-screen">
          {children}
        </main>

      </body>
    </html>
  );
}
