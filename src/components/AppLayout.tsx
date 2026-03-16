import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background dark flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-sidebar-border bg-sidebar sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-6 h-6 object-cover rounded" />
          <span className="font-bold text-sidebar-accent-foreground">Ledger App</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 text-sidebar-muted">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-sidebar border-r-sidebar-border">
            <AppSidebar onNavigate={() => setOpen(false)} isMobile={true} />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
