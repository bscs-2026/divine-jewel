import type { Metadata } from "next";
import "./globals.css";

// Import Poppins font
import { Poppins } from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Divine Jewel",
  description: "A jewelry store for all your needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply Poppins font to the entire body */}
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
