import "./globals.css";
import { ReactNode } from "react";
import SidebarWrapper from "@/components/SidebarWrapper";
import Script from "next/script";

//const Sidebar = dynamic<{children : ReactNode}>(() => import("@/components/Sidebar"), { ssr: false });

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="en">
      <body className="font-sans min-h-screen tracking-[2px] !bg-white">

        <SidebarWrapper>{children}</SidebarWrapper>
        <div
          id="notificationList"
          className="fixed top-2 right-3 w-[350px] shadow-md hidden"
        ></div>
        {/* External scripts */}
        <Script
          src="https://kit.fontawesome.com/38543cd594.js"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
