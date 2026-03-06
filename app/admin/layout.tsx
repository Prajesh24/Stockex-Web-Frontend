import { ReactNode } from "react";
import Header from "./_components/Header";
import Sidebar from "./_components/SideBar";



interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    
      <div className="flex-1 flex flex-col"><Header />
        <div className="flex h-screen bg-black"> <Sidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}