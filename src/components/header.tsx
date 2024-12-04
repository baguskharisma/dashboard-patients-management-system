import { Bell, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b lg:px-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800 lg:text-2xl">
          Patient Management
        </h1>
      </div>
      <div className="flex items-center space-x-2 lg:space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
