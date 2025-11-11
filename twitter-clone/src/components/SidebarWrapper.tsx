"use client";
import Sidebar from "./Sidebar";

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return <Sidebar>{children}</Sidebar>;
}
