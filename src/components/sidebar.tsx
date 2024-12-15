import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  X,
  FileIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/patients", label: "Patients", icon: Users },
    { href: "/appointments", label: "Appointments", icon: Calendar },
    { href: "/records", label: "Records", icon: FileText },
    { href: "/invoices", label: "Invoices", icon: FileIcon },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-50 w-64 p-4 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto bg-white border-r`}
    >
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <h2 className="text-xl font-semibold">Menu</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <nav className="space-y-2 lg:mt-16">
        {links.map((link) => (
          <Button
            key={link.href}
            variant={pathname === link.href ? "secondary" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link href={link.href}>
              <link.icon className="mr-2 h-4 w-4" />
              {link.label}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
}
