import { SidebarTrigger } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { SearchInput } from "./search-input"
import { AuthButton } from "@/modules/auth/ui/components/auth-button"
import { ModeToggle } from "@/components/theme-changer"

export const HomeNavbar = () => {
  return (
    <nav className="fixed left-0 right-0 top-0 h-16 z-50 bg-background flex items-center px-2 pr-5">
      <div className="flex items-center gap-4 w-full">
        {/* Menu and Logo */}

        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link href="/" className="hidden md:block">
            <div className="flex p-4 items-center gap-1">
              <Image src="/logo.svg" width={32} height={32} alt="main-logo" />
              <p className="text-xl font-semibold tracking-tight">NodeStream</p>
            </div>
          </Link>
        </div>
        {/* Search Bar */}

        <div className="flex-1 flex justify-center max-w-[720px] mx-auto">
          <SearchInput />
        </div>

        <div className="flex-shrink-0 items-center flex gap-4">
          <AuthButton />
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}