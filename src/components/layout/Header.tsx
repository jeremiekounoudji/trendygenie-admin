import { Button, Avatar, Popover, PopoverTrigger, PopoverContent, Divider } from '@heroui/react';
import type { User } from '../../types/user';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onMenuClick: () => void;
}

export function Header({ user, onLogout, onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-default-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 shadow-sm">
      {/* Mobile menu button */}
      <Button
        isIconOnly
        variant="light"
        className="md:hidden text-default-700"
        onPress={onMenuClick}
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </Button>

      {/* Mobile logo */}
      <div className="md:hidden flex items-center">
        <span className="text-lg font-bold text-primary">TrendyGenie</span>
      </div>

      {/* Desktop page title area */}
      <div className="hidden md:block">
        <h1 className="text-lg font-semibold text-default-800">Admin Panel</h1>
      </div>

      {/* User menu */}
      <div className="flex items-center gap-4">
        {user ? (
          <Popover placement="bottom-end" showArrow>
            <PopoverTrigger>
              <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-default-100 transition-colors cursor-pointer">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-default-800">{user.full_name}</p>
                  <p className="text-xs text-default-500">{user.user_type}</p>
                </div>
                <Avatar
                  src={user.profile_image || undefined}
                  name={user.full_name}
                  size="sm"
                  className="cursor-pointer ring-2 ring-primary/30"
                  classNames={{
                    base: "bg-primary/10",
                    name: "text-primary font-semibold"
                  }}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0">
              {/* User Info Section */}
              <div className="p-4 bg-primary/5">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={user.profile_image || undefined}
                    name={user.full_name}
                    size="lg"
                    className="ring-2 ring-primary/20"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-default-900 truncate">{user.full_name}</p>
                    <p className="text-sm text-default-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      {user.user_type}
                    </span>
                  </div>
                </div>
              </div>
              
              <Divider />
              
              {/* Account Details */}
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-default-500">Phone</span>
                  <span className="text-default-700">{user.phone || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-default-500">Email Verified</span>
                  <span className={user.is_email_verified ? 'text-success' : 'text-warning'}>
                    {user.is_email_verified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-default-500">Status</span>
                  <span className={user.is_active ? 'text-success' : 'text-danger'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <Divider />
              
              {/* Logout Button */}
              <div className="p-2">
                <Button
                  color="danger"
                  variant="flat"
                  className="w-full"
                  onPress={onLogout}
                  startContent={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  }
                >
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="w-8 h-8 rounded-full bg-default-200 animate-pulse" />
        )}
      </div>
    </header>
  );
}

export default Header;
