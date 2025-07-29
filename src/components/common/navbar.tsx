import { SidebarTrigger } from '@/components/ui/sidebar';
import Breadcrumb from '@/components/common/breadcrumb';

export function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4  mx-auto">
        <Breadcrumb />
        <div className="flex items-center ml-auto space-x-4">
          <SidebarTrigger />
        </div>
      </div>
    </nav>
  );
}
