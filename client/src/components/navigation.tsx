import { Palette, Bell, Settings } from "lucide-react";
import type { User } from "@shared/schema";

interface NavigationProps {
  user?: User;
}

export default function Navigation({ user }: NavigationProps) {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2" data-testid="logo">
              <Palette className="text-2xl text-primary" />
              <h1 className="text-xl font-bold text-foreground" data-testid="app-title">CraftAI</h1>
            </div>
            <span className="text-sm text-muted-foreground" data-testid="app-tagline">
              Empowering Artisans with AI
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-muted-foreground hover:text-foreground" data-testid="button-notifications">
              <Bell className="text-lg" />
            </button>
            <button className="text-muted-foreground hover:text-foreground" data-testid="button-settings">
              <Settings className="text-lg" />
            </button>
            {user?.profileImage && (
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="w-8 h-8 rounded-full" 
                data-testid="img-profile"
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
