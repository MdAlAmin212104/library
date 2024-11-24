"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import AuthProvider from "./services/SessionProvider";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.includes("dashboard");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <AuthProvider>
            {!isDashboard && <Navbar />}
            <main>{children}</main>
            {!isDashboard && <Footer />}
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}