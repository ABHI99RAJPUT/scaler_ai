import type { Metadata } from "next";
import "@cloudscape-design/global-styles/index.css";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import ClientLayout from "../components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "Route 53",
  description: "AWS Route53 Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
