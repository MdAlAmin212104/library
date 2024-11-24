'use client'
import { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import AuthProvider from "./services/SessionProvider";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

// Load custom fonts
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

// Root layout component
export default function RootLayout({
  children,
  pageType = "general",
}: {
  children: ReactNode;
  pageType?: "general" | "dashboard";
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <AuthProvider>
            {pageType === "general" && <Navbar />}
            {children}
            {pageType === "general" && <Footer />}
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
