"use client";
import { usePathname } from "next/navigation";

export default function Sidebar({ children }: { children: React.ReactNode }) {
    const pathName = usePathname();
    const isAuth = pathName.startsWith("/auth");

    if (isAuth){
        return <>{children}</>
    }
    return (
        <>
            <nav className="fixed top-[25%] left-[18%] flex flex-col max-w-[13%] space-y-2">
                <a href="/" className="flex items-center p-3 text-lg hover:text-sky-500 relative">
                    <i className="fa-brands fa-twitter text-sky-500 text-2xl mr-2" suppressHydrationWarning/>
                </a>
                <a href="/" className="flex items-center p-3 hover:text-sky-500 relative">
                    <i className="fa-solid fa-house text-black mr-2" suppressHydrationWarning/>
                    <span className="text-black">Home</span>
                </a>
                <a href="/search" className="flex items-center p-3 hover:text-sky-500 relative">
                    <i className="fa-solid fa-magnifying-glass mr-2 text-black" suppressHydrationWarning/>
                    <span className="text-black">Search</span>
                </a>
                <a href="/notifications" className="flex items-center p-3 hover:text-sky-500 relative">
                    <i className="fa-regular fa-bell mr-2 text-black" suppressHydrationWarning/>
                    <span className="text-black">Notifications</span>
                    <span
                        id="notificationBadge"
                        className="absolute right-2 top-2 hidden h-6 w-6 rounded-full bg-red-600 text-white text-sm items-center justify-center"
                    >
                        7
                    </span>
                </a>
                <a href="/chats" className="flex items-center p-3 hover:text-sky-500 relative">
                    <i className="fa-solid text-black fa-inbox mr-2" suppressHydrationWarning/>
                    <span className="text-black">Messages</span>
                    <span
                        id="messageBadge"
                        className="absolute right-2 top-2 hidden h-6 w-6 rounded-full bg-red-600 text-white text-sm items-center justify-center"
                    >
                        5
                    </span>
                </a>
                <a href="/profile" className="flex items-center p-3 hover:text-sky-500">
                    <i className="fa-solid fa-user mr-2 text-black" suppressHydrationWarning/>
                    <span className="text-black">Account</span>
                </a>
                <a href="/logout" className="flex items-center p-3 hover:text-sky-500">
                    <i className="fa-solid fa-right-from-bracket mr-2 text-black" suppressHydrationWarning/>
                    <span className="text-black">Logout</span>
                </a>
            </nav>
            <main className={"flex-1 min-h-screen ml-[30%] mr-[10%] border-x border-gray-300"}>
                <div className="flex flex-col h-full">{children}</div>
            </main>
        </>
    )
}