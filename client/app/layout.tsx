"use client";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import React, { useEffect } from "react";
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  useEffect(() => {
    socketId.on("connection", () => {});
  }, []);

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
