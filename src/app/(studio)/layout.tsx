import { StudioLayout } from "@/modules/studio/ui/layouts/studio-layout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <StudioLayout>
      {children}
    </StudioLayout>
  )
}

export default Layout;