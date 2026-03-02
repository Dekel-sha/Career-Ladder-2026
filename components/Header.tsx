import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Settings, LogOut, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: 'dashboard' | 'applications' | 'analytics' | 'settings') => void;
  onLogout: () => void;
  onOpenSettings?: () => void;
}

export function Header({ onNavigate, onLogout, onOpenSettings }: HeaderProps) {
  return (
    <>
      <style>{`
        .user-profile-trigger {
          display: flex;
          align-items: center;
          gap: var(--space-12);
          border-radius: var(--radius-unified);
          padding: var(--space-8) var(--space-12);
          border: none;
          background: transparent;
          cursor: pointer;
          transition: background-color 150ms ease-in-out;
          font-family: var(--font-family-body);
        }
        
        .user-profile-trigger:hover {
          background: var(--vibe-hover-bg);
        }
        
        .user-profile-trigger:focus {
          outline: none;
        }
        
        .user-profile-trigger:focus-visible {
          outline: 2px solid var(--ring);
          outline-offset: 2px;
        }
        
        .dropdown-item-settings {
          padding: var(--space-8) var(--space-12);
          border-radius: var(--radius);
          cursor: pointer;
          font-family: var(--font-family-body);
          font-size: var(--text-sm);
          color: var(--vibe-text-primary);
          display: flex;
          align-items: center;
          gap: var(--space-8);
          background: transparent;
          transition: background-color 150ms ease-in-out;
        }
        
        .dropdown-item-settings:hover {
          background: var(--vibe-hover-bg);
          color: var(--vibe-text-primary);
        }
        
        .dropdown-item-settings:focus {
          background: var(--vibe-hover-bg);
          color: var(--vibe-text-primary);
          outline: none;
        }
        
        .dropdown-item-logout {
          padding: var(--space-8) var(--space-12);
          border-radius: var(--radius);
          cursor: pointer;
          font-family: var(--font-family-body);
          font-size: var(--text-sm);
          display: flex;
          align-items: center;
          gap: var(--space-8);
          background: transparent;
          transition: background-color 150ms ease-in-out;
          color: var(--destructive);
        }
        
        .dropdown-item-logout:hover {
          background: var(--vibe-hover-bg);
          color: var(--destructive);
        }
        
        .dropdown-item-logout:focus {
          background: var(--vibe-hover-bg);
          color: var(--destructive);
          outline: none;
        }
      `}</style>
      
      <header 
        style={{
          background: 'transparent',
          borderBottom: 'none',
          paddingLeft: 'var(--spacing-md)',
          paddingRight: '16px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          boxShadow: 'none',
        }}
      >
        {/* User Profile Dropdown - Vibe UI Kit */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="user-profile-trigger">
              <Avatar 
                style={{
                  width: '40px',
                  height: '40px',
                }}
              >
                <AvatarImage src="" />
                <AvatarFallback 
                  style={{
                    background: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    fontFamily: 'var(--font-family-body)',
                  }}
                >
                  JD
                </AvatarFallback>
              </Avatar>
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <span 
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-family-body)',
                    color: 'var(--vibe-text-primary)',
                    fontWeight: '500',
                  }}
                >
                  John Doe
                </span>
                <span 
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-family-body)',
                    color: 'var(--vibe-text-secondary)',
                  }}
                >
                  Designer
                </span>
              </div>
              <ChevronDown 
                style={{
                  width: '16px',
                  height: '16px',
                  color: 'var(--vibe-text-secondary)',
                }}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            side="bottom"
            sideOffset={4}
            style={{
              width: '224px',
              borderRadius: 'var(--radius-unified)',
              border: '1px solid var(--border)',
              background: 'var(--card)',
              boxShadow: 'var(--elevation-sm)',
              padding: 'var(--space-8)',
            }}
          >
            <DropdownMenuItem
              onClick={() => onOpenSettings ? onOpenSettings() : onNavigate('settings')}
              className="dropdown-item-settings"
            >
              <Settings 
                style={{
                  width: '16px',
                  height: '16px',
                  color: 'var(--vibe-text-secondary)',
                }}
              />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator 
              style={{
                margin: 'var(--space-8) 0',
                background: 'var(--border)',
              }}
            />
            <DropdownMenuItem
              onClick={onLogout}
              variant="destructive"
              className="dropdown-item-logout"
            >
              <LogOut 
                style={{
                  width: '16px',
                  height: '16px',
                }}
              />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </>
  );
}
