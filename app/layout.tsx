import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jíbaro Newz — Astrología",
  description:
    "Motor de astrología a nivel de signo para el newsletter Jíbaro Newz.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
