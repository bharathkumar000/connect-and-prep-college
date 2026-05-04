'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { mockBackend } from '../../services/mockBackend';
import {
    BookOpen, BarChart2, FileText, Users, MessageSquare, Award,
    LogOut, Menu, X, Layout, Library, GraduationCap, Calendar,
    UserCheck, Timer, Bell, Sun, Moon, Target, Trophy, Briefcase,
    Pencil, Clock, Hash, BrainCircuit, Calculator, Activity,
    Flame, StickyNote, CheckCircle2, Shield, Ghost, 
    Home, Wallet, ShieldAlert, TrendingUp, BookOpenCheck
} from 'lucide-react';
import '../../components/layout/DashboardLayout.css';

const DashboardLayout = ({ children }) => {
    const { user, logout, loading } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (loading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff' }}>INITIALIZING NODE...</div>;
    }

    if (!user) {
        return null;
    }

    const studentNav = [
        { label: 'Dashboard', icon: <Layout size={20} />, path: '/dashboard' },
        { label: 'Assignment Hub', icon: <BookOpenCheck size={20} />, path: '/dashboard/assignments' },
        { label: 'Attendance List', icon: <Calendar size={20} />, path: '/dashboard/attendance' },
        { label: 'Timetable', icon: <Clock size={20} />, path: '/dashboard/timetable' },
        { label: 'Notes & PYQs', icon: <BookOpen size={20} />, path: '/dashboard/notes' },
        { type: 'divider' },
        { label: 'Doubt Solving', icon: <MessageSquare size={20} />, path: '/dashboard/doubts' },
        { label: 'Study Zone', icon: <Users size={20} />, path: '/dashboard/studyzone' },
        { label: 'Discussion Forum', icon: <Hash size={20} />, path: '/dashboard/chat' },
        { label: 'Answer Analysis', icon: <BarChart2 size={20} />, path: '/dashboard/analysis' },
        { label: 'Activity Feed', icon: <Activity size={20} />, path: '/dashboard/feed' },
        { label: 'CGPA Calculator', icon: <Calculator size={20} />, path: '/dashboard/cgpa' },
        { label: 'Weekly Challenges', icon: <Flame size={20} />, path: '/dashboard/challenges' },
        { label: 'Smart Exam Predictor', icon: <BrainCircuit size={20} />, path: '/dashboard/predictor' },
        { type: 'divider' },
        { label: 'Leaderboard & XP', icon: <Trophy size={20} />, path: '/dashboard/leaderboard' },
        { label: 'Placements & Interns', icon: <Briefcase size={20} />, path: '/dashboard/placements' },
        { label: 'Complaint Box', icon: <Shield size={20} />, path: '/dashboard/complaints' },
        { label: 'Anonymous Box', icon: <Ghost size={20} />, path: '/dashboard/anonymous-chat' },
    ];

    const parentNav = [
        { label: 'Parent Dashboard', icon: <Home size={20} />, path: '/dashboard/parent-dashboard' },
        { label: 'Child Performance', icon: <TrendingUp size={20} />, path: '/dashboard/parent-dashboard' },
        { label: 'Attendance & Class', icon: <Calendar size={20} />, path: '/dashboard/attendance' },
        { type: 'divider' },
        { label: 'Finance Portal', icon: <Wallet size={20} />, path: '/dashboard/finance' },
        { label: 'Safety Monitor', icon: <ShieldAlert size={20} />, path: '/dashboard/safety' },
        { label: 'Teacher\'s Diary', icon: <BookOpenCheck size={20} />, path: '/dashboard/teachers-diary' },
        { label: 'Smart Exam Predictor', icon: <BrainCircuit size={20} />, path: '/dashboard/predictor' },
    ];

    const navItems = user?.role === 'parent' ? parentNav : studentNav;

    const currentLabel = navItems
        .filter(i => i.path)
        .slice()
        .sort((a, b) => b.path.length - a.path.length)
        .find(i => pathname.startsWith(i.path))?.label || 'Dashboard';

    const notifications = mockBackend.notifications || [];
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="dashboard-container">
            {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

            <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-area">
                        <GraduationCap size={32} />
                        <span className="sidebar-text">Connect & Prep</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item, idx) => (
                        item.type === 'divider' ? (
                            <div key={`divider-${idx}`} className="nav-divider" />
                        ) : (
                            <div
                                key={item.path}
                                className={`nav-item ${pathname === item.path ? 'active' : ''}`}
                                onClick={() => { router.push(item.path); setSidebarOpen(false); }}
                            >
                                <div className="icon-container">{item.icon}</div>
                                <span className="sidebar-text">{item.label}</span>
                            </div>
                        )
                    ))}
                </nav>
            </aside>

            <main className="main-content">
                <header className="top-bar">
                    <div className="top-bar-left">
                        <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <h2>{currentLabel}</h2>
                    </div>

                    <div className="header-right-section" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button className="notification-btn-header" onClick={toggleTheme}>
                            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                        </button>

                        <div className="notif-wrapper">
                            <button className="notification-btn-header" onClick={() => router.push('/dashboard/notifications')}>
                                <Bell size={24} />
                                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                            </button>
                        </div>

                        <div className="profile-dropdown-container">
                            <ProfileMenu user={user} logout={handleLogout} />
                        </div>
                    </div>
                </header>

                <div className="content-area">
                    {children}
                </div>
            </main>
        </div>
    );
};

const ProfileMenu = ({ user, logout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    return (
        <div className="profile-menu-wrapper">
            <button className="profile-btn" onClick={() => setIsOpen(!isOpen)}>
                <div className="avatar-circle">{user?.name?.charAt(0) || 'U'}</div>
                <div className="user-text">
                    <span className="name">{user?.name || 'User'}</span>
                    <span className="role">{user?.role || 'Student'}</span>
                </div>
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-header">
                        <p className="d-name">Name: {user?.name}</p>
                        <p className="d-usn">USN: 4VV25EC032</p>
                    </div>
                    <div className="dropdown-item" onClick={() => { router.push('/dashboard/profile'); setIsOpen(false); }}>Profile</div>
                    <div className="dropdown-item logout" onClick={logout}>
                        <LogOut size={16} /> Logout
                    </div>
                </div>
            )}
            {isOpen && <div className="backdrop" onClick={() => setIsOpen(false)} />}
        </div>
    );
};

export default DashboardLayout;
