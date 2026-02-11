import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Map, FileText, Settings, Plus, LogOut, Bell, Search, Menu } from 'lucide-react';
// Minimal avatar placeholder or icon
import { User } from 'lucide-react';

const DashboardLayout = () => {
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
            }
        }
    }, []);

    const notifications = [
        { id: 1, title: 'New Review', message: 'Your Python script has been reviewed.', time: '2m ago' },
        { id: 2, title: 'Streak!', message: 'You reached a 7-day streak!', time: '1h ago' },
        { id: 3, title: 'Welcome', message: 'Welcome to CodeMentor AI Pro.', time: '1d ago' },
    ];

    return (
        <div className="flex h-screen bg-primary text-text-primary overflow-hidden">

            {/* Sidebar */}
            <aside className="w-64 bg-secondary border-r border-white/5 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-white/5">
                    <Link to="/">
                        <h1 className="text-xl font-bold text-accent hover:opacity-80 transition-opacity">CodeMentor AI</h1>
                    </Link>
                </div>

                <div className="p-4">
                    <Link to="/dashboard/chat" className="w-full py-3 mb-6 bg-gradient-to-r from-accent/20 to-purple/20 border border-accent/30 rounded-xl text-white flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                        <Plus className="w-5 h-5" />
                        <span>New Chat</span>
                    </Link>

                    <nav className="flex flex-col gap-2">
                        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <NavItem to="/dashboard/roadmap" icon={Map} label="Learning Road Map" />
                        <NavItem to="/dashboard/reports" icon={FileText} label="Reports" />
                        <NavItem to="/dashboard/settings" icon={Settings} label="Setting" />
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-white/5">
                    <NavLink to="/dashboard/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors user-profile-btn relative group">
                        <div className="w-10 h-10 rounded-full bg-purple/20 flex items-center justify-center text-purple border border-purple/30">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-text-primary">
                                {user?.user_metadata?.full_name || user?.email || 'User'}
                            </h4>
                            {user?.user_metadata?.pro_member && (
                                <span className="text-xs text-green-400 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span> Pro Member
                                </span>
                            )}
                        </div>

                        {/* Logout Tooltip/Menu (Simple) */}
                        <div className="absolute bottom-full left-0 w-full bg-secondary border border-white/10 rounded-lg p-2 mb-2 hidden group-hover:block z-50">
                            <button className="w-full text-left text-sm p-2 hover:bg-white/5 rounded text-red-400 flex items-center gap-2">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    </NavLink>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">

                {/* Top Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-secondary/50 backdrop-blur-sm relative z-50">
                    <button className="md:hidden p-2">
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="relative w-96 hidden md:block">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-primary border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-4 relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 hover:bg-white/5 rounded-full transition-colors"
                        >
                            <Bell className="w-5 h-5 text-text-secondary" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-secondary border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                                <div className="p-4 border-b border-border flex justify-between items-center">
                                    <h3 className="font-bold text-text-primary">Notifications</h3>
                                    <span className="text-xs text-accent cursor-pointer hover:underline">Mark all read</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                    {notifications.map(notif => (
                                        <div key={notif.id} className="p-4 border-b border-border hover:bg-white/5 transition-colors cursor-pointer">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-sm font-semibold text-text-primary">{notif.title}</h4>
                                                <span className="text-[10px] text-text-secondary">{notif.time}</span>
                                            </div>
                                            <p className="text-xs text-text-secondary line-clamp-2">{notif.message}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 text-center border-t border-white/10">
                                    <NavLink
                                        to="/dashboard/reports"
                                        onClick={() => setShowNotifications(false)}
                                        className="inline-block text-xs text-text-primary border border-border rounded-lg px-4 py-2 hover:bg-text-primary/5 hover:underline transition-colors"
                                    >
                                        View All Activity
                                    </NavLink>
                                </div>
                            </div>
                        )}

                        {/* Backdrop to close */}
                        {showNotifications && (
                            <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowNotifications(false)}></div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 relative">
                    {/* Background Glow */}
                    <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple/5 rounded-full blur-[100px] pointer-events-none"></div>

                    <Outlet />
                </main>
            </div>

        </div>
    );
};

const NavItem = ({ to, icon: Icon, label }) => {
    return (
        <NavLink
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                    ? 'bg-gradient-to-r from-accent/10 to-transparent border-l-4 border-accent text-text-primary'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                }`
            }
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </NavLink>
    );
};

export default DashboardLayout;
