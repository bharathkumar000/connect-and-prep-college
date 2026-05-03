'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Cpu, Zap, Lock, Globe, ArrowRight } from 'lucide-react';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('STUDENT'); // Role toggle: STUDENT / FACULTY

    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="login-wrapper">
            <div className="login-dual-panel">
                {/* Left Sidebar - System Info */}
                <div className="login-sidebar">
                    <div className="sidebar-logo">
                        <div className="logo-box">
                            <ShieldCheck size={32} strokeWidth={2.5} color="#fbbf24" />
                        </div>
                        <span className="logo-text">CONNECT & PREP</span>
                    </div>

                    <div className="sidebar-content">
                        <h2 className="system-title">SYSTEM SYNC</h2>
                        <p className="system-sub">Synchronize your identification parameters to initiate node connection.</p>

                        <ul className="feature-list">
                            <li><Zap size={16} /> INSTANT ACCESS VALIDATION</li>
                            <li><Lock size={16} /> MILITARY GRADE ENCRYPTION</li>
                            <li><Cpu size={16} /> REAL-TIME ANALYTICS CORE</li>
                            <li><Globe size={16} /> PERIMETER MONITORING</li>
                        </ul>
                    </div>

                    <div className="sidebar-footer">
                        <div className="version-info">
                            <div className="v-line" />
                            <span>PROTOCOL 4.2.0 - S</span>
                        </div>
                        <div className="footer-links">
                            <span>PRIVACY</span>
                            <span>SUPPORT</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form Area */}
                <div className="login-main">
                    <div className="form-container">
                        <div className="sync-header">
                            <span className="platform-label">INSTITUTIONAL SYNC HUB</span>
                            <h1>WELCOME</h1>
                            <p>SYNCHRONIZE YOUR IDENTIFICATION PARAMETERS</p>
                        </div>

                        <div className="role-selector">
                            <button 
                                className={`role-pill ${role === 'STUDENT' ? 'active' : ''}`}
                                onClick={() => setRole('STUDENT')}
                            >
                                I'M A STUDENT
                            </button>
                            <button 
                                className={`role-pill ${role === 'FACULTY' ? 'active' : ''}`}
                                onClick={() => setRole('FACULTY')}
                            >
                                I'M A FACULTY
                            </button>
                        </div>

                        <form onSubmit={handleLogin} className="sync-form">
                            <div className="input-group">
                                <label>NODE CREDENTIALS</label>
                                <div className="input-field-wrap">
                                    <Globe size={18} className="field-icon" />
                                    <input
                                        type="text"
                                        placeholder="authorized@institution.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>SECURITY PROTOCOL KEY</label>
                                <div className="input-field-wrap">
                                    <Lock size={18} className="field-icon" />
                                    <input
                                        type="password"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && <div className="sync-error-msg">{error}</div>}

                            <button type="submit" className="establish-link-btn" disabled={loading}>
                                {loading ? 'SYNCHRONIZING...' : (
                                    <>
                                        ESTABLISH LINK <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            <div className="form-alt-footer">
                                <span>NEW NODE SIGNATURE?</span>
                                <Link href="/register" className="register-link">Enroll Node</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
