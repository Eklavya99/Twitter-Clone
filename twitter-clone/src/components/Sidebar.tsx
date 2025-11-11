"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function Sidebar({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathName = usePathname();
    const isAuth = pathName.startsWith("/auth");

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            if (response.ok) {
                router.push("/auth/login");
            }

        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (isAuth) {
        return <>{children}</>
    }
    return (
        <>
            <nav className="fixed top-[25%] left-[18%] flex flex-col max-w-[13%] space-y-2">
                <Link href="/" className="flex items-center p-3 text-lg hover:text-sky-500 relative">
                    <i className="fa-brands fa-twitter text-sky-500 text-2xl mr-2" suppressHydrationWarning />
                </Link>
                <Link href="/" className="flex items-center p-3 hover:text-sky-500 relative">
                    <i className="fa-solid fa-house text-black mr-2" suppressHydrationWarning />
                    <span className="text-black">Home</span>
                </Link>
                <Link href="/search" className="flex items-center p-3 hover:text-sky-500 relative">
                    <i className="fa-solid fa-magnifying-glass mr-2 text-black" suppressHydrationWarning />
                    <span className="text-black">Search</span>
                </Link>
                <Link href="/notifications" className="flex items-center p-3 hover:text-sky-500 relative">
                    <i className="fa-regular fa-bell mr-2 text-black" suppressHydrationWarning />
                    <span className="text-black">Notifications</span>
                    <span
                        id="notificationBadge"
                        className="absolute right-2 top-2 hidden h-6 w-6 rounded-full bg-red-600 text-white text-sm items-center justify-center"
                    >
                        7
                    </span>
                </Link>
                <Link href="/chats" className="flex items-center p-3 hover:text-sky-500 relative">
                    <i className="fa-solid text-black fa-inbox mr-2" suppressHydrationWarning />
                    <span className="text-black">Messages</span>
                    <span
                        id="messageBadge"
                        className="absolute right-2 top-2 hidden h-6 w-6 rounded-full bg-red-600 text-white text-sm items-center justify-center"
                    >
                        5
                    </span>
                </Link>
                <Link href="/profile" className="flex items-center p-3 hover:text-sky-500">
                    <i className="fa-solid fa-user mr-2 text-black" suppressHydrationWarning />
                    <span className="text-black">Account</span>
                </Link>
                <button onClick={handleLogout} className="cursor-pointer flex items-center p-3 hover:text-sky-500">
                    <i className="fa-solid fa-right-from-bracket mr-2 text-black" suppressHydrationWarning />
                    <span className="text-black">Logout</span>
                </button>
            </nav>
            <main className={"flex-1 min-h-screen ml-[30%] mr-[10%] border-x border-gray-300"}>
                <div className="flex flex-col h-full">{children}</div>
            </main>
        </>
    )
}