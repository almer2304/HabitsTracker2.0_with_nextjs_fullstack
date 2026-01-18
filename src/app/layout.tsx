import "./globals.css";
import { Providers } from "@/components/Providers"; // Import file yang baru dibuat

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Bungkus children dengan Providers */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}