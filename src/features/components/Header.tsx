import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/context/AuthContext';
import { 
  Bell, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  Trophy,
  BookOpen,
  Target,
  Menu,
  X,
  BarChart3,
  HelpCircle
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'achievement' | 'lesson' | 'streak' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: string;
}

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Mock notifications - replace with real data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'achievement',
      title: 'New Achievement! 🎉',
      message: 'You completed 5 lessons in a row!',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      icon: '🏆'
    },
    {
      id: '2',
      type: 'lesson',
      title: 'New Lesson Available',
      message: 'Check out "Advanced React Hooks"',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      icon: '📚'
    },
    {
      id: '3',
      type: 'streak',
      title: '7 Day Streak! 🔥',
      message: "You're on fire! Keep it up!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
      icon: '🔥'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <nav className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to={user ? "/dashboard" : "/"} 
            className="flex items-center gap-2 group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">
              🏋️
            </span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              React Gym
            </span>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <div className="hidden md:flex items-center gap-6">
              {/* Navigation Links */}
              <div className="flex items-center gap-1">
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Dashboard
                  </div>
                </Link>

                <Link
                  to="/roadmap"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/roadmap')
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Roadmap
                  </div>
                </Link>

                <Link
                  to="/progress"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/progress')
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Progress
                  </div>
                </Link>
              </div>

              {/* Right side - Notifications & User Menu */}
              <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      {/* Notifications list */}
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() => markAsRead(notification.id)}
                              className={`w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors ${
                                !notification.read ? 'bg-blue-50/50' : ''
                              }`}
                            >
                              <div className="flex gap-3">
                                <span className="text-2xl flex-shrink-0">
                                  {notification.icon}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="font-medium text-gray-900 text-sm">
                                      {notification.title}
                                    </p>
                                    {!notification.read && (
                                      <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mt-0.5">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {getTimeAgo(notification.timestamp)}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-100 bg-gray-50">
                          <Link
                            to="/notifications"
                            className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View all notifications
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 p-2 pr-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* User Avatar */}
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url||''}
                        alt={user.displayName || 'User'}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-white shadow-sm">
                        {getUserInitials(user?.displayName || 'User')}
                      </div>
                    )}

                    {/* User Name */}
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.displayName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Level {user?.level || 1}
                      </p>
                    </div>

                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      {/* User Info */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          {user?.avatar_url ? (
                            <img
                              src={user.avatar_url||''}
                              alt={user.displayName || 'User'}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                              {getUserInitials(user?.displayName || 'User')}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {user?.displayName || 'User'}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          <div className="bg-white rounded-lg p-2 text-center">
                            <p className="text-lg font-bold text-blue-600">
                              {user?.totalXp || 0}
                            </p>
                            <p className="text-xs text-gray-600">XP</p>
                          </div>
                          <div className="bg-white rounded-lg p-2 text-center">
                            <p className="text-lg font-bold text-purple-600">
                              {user?.level || 1}
                            </p>
                            <p className="text-xs text-gray-600">Level</p>
                          </div>
                          <div className="bg-white rounded-lg p-2 text-center">
                            <p className="text-lg font-bold text-orange-600">
                              {user?.currentStreak || 0}
                            </p>
                            <p className="text-xs text-gray-600">Streak</p>
                          </div>
                           <div className="bg-white rounded-lg p-2 text-center">
                            <p className="text-lg font-bold text-green-600">
                              {user?.longestStreak || 0}
                            </p>
                            <p className="text-xs text-gray-600">Longest Streak</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            My Profile
                          </span>
                        </Link>

                        <Link
                          to="/achievements"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <Trophy className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Achievements
                          </span>
                        </Link>

                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Settings
                          </span>
                        </Link>

                        <Link
                          to="/help"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <HelpCircle className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Help & Support
                          </span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-200 p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg transition-colors group"
                        >
                          <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">
                            Logout
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Not logged in - Show auth buttons
            <div className="hidden md:flex items-center gap-3">
              <Link to="/how-it-works">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  How It Works
                </button>
              </Link>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top duration-200">
            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-4">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url||''}
                      alt={user.displayName || 'User'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {getUserInitials(user?.displayName || 'User')}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{user?.displayName || 'User'}</p>
                    <p className="text-sm text-gray-600">Level {user?.level || 1}</p>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-1">
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                      isActive('/dashboard')
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Target className="w-5 h-5" />
                    Dashboard
                  </Link>

                  <Link
                    to="/roadmap"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                      isActive('/roadmap')
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    Roadmap
                  </Link>

                  <Link
                    to="/progress"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                      isActive('/progress')
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    Progress
                  </Link>

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link to="/how-it-works">
                  <button className="w-full px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                    How It Works
                  </button>
                </Link>
                <button className="w-full px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  Login
                </button>
                <button className="w-full px-6 py-3 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
                  Get Started
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}