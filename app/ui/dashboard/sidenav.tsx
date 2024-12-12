import Link from 'next/link';
import Image from "next/image";
import NavLinks from "./nav-links";
import { signOutIcon } from "@/app/ui/icons";

export default function SideNav() {
    const Icon = signOutIcon;

    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <Link
                className="mb-2 flex h-fit items-end justify-start rounded-md bg-redunilim p-4 md:h-40"
                href="/"
            >
                <Image
                    src="/logo-unilim.webp"
                    width={300}
                    height={50}
                    alt="Logo Unilim"
                    className="bg-background p-2 rounded-lg"
                    priority
                />
            </Link>
            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <NavLinks />
                <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:px-8 md:flex md:items-center">
                </div>
                <form>
                    <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-redLight hover:text-redHover md:flex-none md:justify-start md:p-2 md:px-3">
                        <Icon className="w-6" />
                        <div className="hidden md:block">Se Déconnecter</div>
                    </button>
                </form>
            </div>
        </div>
    );
}