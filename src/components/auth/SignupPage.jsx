'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Cpu, Zap, Lock, Globe, ArrowRight, User } from 'lucide-react';
import './SignupPage.css';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('STUDENT');

    const { login } = useAuth(); // Assuming login or register exists in context
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError("PROTOCOL ERROR: PASSWORDS DO NOT MATCH");
            return;
        }

        setLoading(true);
        // Mock signup logic
        setTimeout(() => {
            setLoading(false);
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <div className="login-wrapper">
            <div className="login-dual-panel signup-mode">
                
                {/* Left Panel - Form Area (Matching screenshot 1) */}
                <div className="login-main">
                    <div className="form-container">
                        <div className="sync-header">
                            <span className="platform-label">INNOVATORS AND VISIONARIES CLUB</span>
                            <h1>INITIALIZE</h1>
                            <p>SYNCHRONIZE YOUR IDENTIFICATION PARAMETERS</p>
                        </div>

                        <div className="role-selector">
                            <button 
                                className={`role-pill ${role === 'STUDENT' ? 'active' : ''}`}
                                onClick={() => setRole('STUDENT')}
                            >
                                I'M A CANDIDATE
                            </button>
                            <button 
                                className={`role-pill ${role === 'FACULTY' ? 'active' : ''}`}
                                onClick={() => setRole('FACULTY')}
                            >
                                I'M AN EVALUATOR
                            </button>
                        </div>

                        <form onSubmit={handleSignup} className="sync-form">
                            <div className="input-group">
                                <label>AUTHORIZED NAME</label>
                                <div className="input-field-wrap">
                                    <User size={18} className="field-icon" />
                                    <input
                                        type="text"
                                        placeholder="Enter Node Identity Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>NODE CREDENTIALS</label>
                                <div className="input-field-wrap">
                                    <Globe size={18} className="field-icon" />
                                    <input
                                        type="email"
                                        placeholder="authorized@skillforge.io"
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

                            <div className="input-group">
                                <label>CONFIRM KEY</label>
                                <div className="input-field-wrap">
                                    <Lock size={18} className="field-icon" />
                                    <input
                                        type="password"
                                        placeholder="••••••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && <div className="sync-error-msg">{error}</div>}

                            <button type="submit" className="establish-link-btn" disabled={loading}>
                                {loading ? 'INITIALIZING...' : (
                                    <>
                                        INITIALIZE SYNC <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            <div className="form-alt-footer">
                                <span>ALREADY ENROLLED?</span>
                                <Link href="/login" className="register-link">Sync Credentials</Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Sidebar - Info Panel (Matching screenshot 1 side swap) */}
                <div className="login-sidebar">
                    <div className="sidebar-logo">
                        <div className="logo-box">
                            <ShieldCheck size={32} strokeWidth={2.5} color="#fbbf24" />
                        </div>
                        <span className="logo-text">SKILL FORGE</span>
                    </div>

                    <div className="sidebar-content">
                        <h2 className="system-title">CONNECT NODE</h2>
                        <p className="system-sub">Establish your node presence in the NEXUS protocol layers for institutional access.</p>

                        <ul className="feature-list">
                            <li><Zap size={16} /> INSTANT VALIDATION</li>
                            <li><Lock size={16} /> MILITARY GRADE ENCRYPTION</li>
                            <li><Cpu size={16} /> BIOMETRIC IDENTITY NODES</li>
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

            </div>
        </div>
    );
};

export default SignupPage;
