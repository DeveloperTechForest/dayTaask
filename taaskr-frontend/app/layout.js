// app/layout.js     ← remains server component
import Providers from "./providers";
import { AuthProvider } from "./context/AuthContext"; // ← import the client wrapper
import { ToastProvider } from "@/components/taaskr/ToastProvider";
import "./globals.css";

export const metadata = {
  title: "Taaskr – Service Provider Platform",
  description: "Earn on your terms as a skilled professional",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
