import "./globals.css";
import { Providers } from "@/components/Providers"; // Import file yang baru dibuat
import { Toaster } from "sonner";

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
        <Toaster position="bottom-right" theme="dark" closeButton />
      </body>
    </html>
  );
}