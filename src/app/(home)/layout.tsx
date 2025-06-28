import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";
export const dynamic = "force-dynamic"

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <HomeLayout>
      {children}
    </HomeLayout>
  )
}

export default Layout;