import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moral Maps 2: Crossroads",
  description:
    "Deel 2 van Moral Maps: navigeer morele kruispunten, energie en koers tijdens je levensreis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-4 text-center">
          <p className="text-xs text-slate-400">
            Dit project maakt deel uit van de reeks{" "}
            <strong className="text-slate-500">Moreel Vakmanschap</strong> van het{" "}
            <a
              href="https://www.linkedin.com/company/lectoraat-ethisch-werken-bijdragen"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-teal-600 hover:underline"
            >
              Fontys Lectoraat Ethisch Werken
            </a>
          </p>
          <p className="mt-1 text-xs text-slate-300">Fontys HRM en TP · Richard Voddé MCC</p>
        </footer>
      </body>
    </html>
  );
}
