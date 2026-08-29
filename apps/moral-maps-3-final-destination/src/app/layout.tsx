import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moral Maps — Final Destination",
  description: "Deel 3 leeft in de geïntegreerde Moral Maps-app.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
