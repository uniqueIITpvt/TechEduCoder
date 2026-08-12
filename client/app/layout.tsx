"use client";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className="!bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300"
      >
        <Providers>        
                {children}
              <Toaster position="top-center" reverseOrder={false} />
        </Providers>
      </body>
    </html>
  );
}
