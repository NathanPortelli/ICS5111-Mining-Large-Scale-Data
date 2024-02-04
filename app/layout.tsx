import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/header";
import { AuthContextProvider } from "./context/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ICS5111 - Diet Recommender",
  description:
    "Project created in fulfilment of the Masters in AI study unit ICS5111 - Mining Large Scale Data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <Header />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
