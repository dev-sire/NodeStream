import { SidebarTrigger } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { AuthButton } from "@/modules/auth/ui/components/auth-button"
import { StudioUploadModal } from "../studio-upload-modal"

export const StudioNavbar = () => {
  return (
    <nav className="fixed left-0 right-0 top-0 h-16 z-50 bg-background flex items-center px-2 pr-5 border-b shadow-md">
      <div className="flex items-center gap-4 w-full">
        {/* Menu and Logo */}

        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link href="/studio" className="hidden md:block">
            <div className="flex p-4 items-center gap-1">
              <Image src="/logo.svg" width={32} height={32} alt="main-logo" />
              <p className="text-xl font-semibold tracking-tight">Studio</p>
            </div>
          </Link>
        </div>

        <div className="flex-1" />

        <div className="flex-shrink-0 items-center flex gap-4">
          <StudioUploadModal />
          <AuthButton />
        </div>
      </div>
    </nav>
  )
}