"use client";
import React from 'react';
import { mockBackend } from '../../services/mockBackend';
import { Bell, Calendar, FileText, Briefcase, Users, CheckCircle, Trash2, Clock } from 'lucide-react';
import './FeatureStyles.css';

const NotificationsPage = () => {
    const notifications = mockBackend.notifications || [];

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <Bell size={24} color="#f87171" />;
            case 'event': return <Calendar size={24} color="#60a5fa" />;
            case 'upload': return <FileText size={24} color="#4ade80" />;
            case 'placement': return <Briefcase size={24} color="#fbbf24" />;
            case 'social': return <Users size={24} color="#f472b6" />;
            default: return <Bell size={24} color="#888" />;
        }
    };

    return (
        <div className="notifications-page-container">
            <div className="yellow-title-box animate-enter" style={{ marginBottom: '2.5rem' }}>
                <h1>NOTIFICATIONS</h1>
            </div>

            <div className="notif-stats-grid animate-enter">
                <div className="stat-card">
                    <span className="stat-value">{notifications.length}</span>
                    <span className="stat-label">Total Notifications</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{notifications.filter(n => !n.read).length}</span>
                    <span className="stat-label">Unread Alerts</span>
                </div>
            </div>

            <div className="notif-main-list animate-enter">
                {notifications.length > 0 ? (
                    notifications.map((n, idx) => (
                        <div key={n.id} className={`notif-full-card ${n.read ? 'read' : 'unread'}`} style={{ animationDelay: `${idx * 0.05}s` }}>
                            <div className="notif-visual">
                                <div className="notif-icon-circle">
                                    {getIcon(n.type)}
                                </div>
                                {!n.read && <div className="unread-dot-pulse" />}
                            </div>
                            
                            <div className="notif-details">
                                <div className="notif-row">
                                    <h3>{n.title}</h3>
                                    <span className="notif-time-tag">
                                        <Clock size={12} /> {n.time}
                                    </span>
                                </div>
                                <p>{n.message}</p>
                                
                                <div className="notif-actions">
                                    <button className="notif-btn-main">View Details</button>
                                    {!n.read && <button className="notif-btn-mark">Mark as Read</button>}
                                    <button className="notif-btn-delete"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-notif-state">
                        <CheckCircle size={64} color="#333" />
                        <h2>All Caught Up!</h2>
                        <p>You don't have any new notifications at the moment.</p>
                    </div>
                )}
            </div>

            <style>{`
                .notifications-page-container {
                    padding: 2rem;
                    max-width: 900px;
                    margin: 0 auto;
                }
                .notif-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                .stat-card {
                    background: #111;
                    border: 2px solid #333;
                    padding: 1.5rem;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                }
                .stat-value {
                    font-size: 2.5rem;
                    font-weight: 900;
                    color: #fbbf24;
                }
                .stat-label {
                    color: #888;
                    font-size: 0.8rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .notif-full-card {
                    background: #111;
                    border: 2px solid #333;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-bottom: 1rem;
                    display: flex;
                    gap: 1.5rem;
                    transition: all 0.2s;
                }
                .notif-full-card.unread {
                    border-color: #fbbf24;
                    background: #161616;
                    box-shadow: 5px 5px 0px rgba(251, 191, 36, 0.1);
                }
                .notif-icon-circle {
                    width: 50px;
                    height: 50px;
                    background: #000;
                    border: 1px solid #333;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .notif-visual {
                    position: relative;
                }
                .unread-dot-pulse {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 12px;
                    height: 12px;
                    background: #fbbf24;
                    border-radius: 50%;
                    border: 2px solid #111;
                }
                .notif-details {
                    flex: 1;
                }
                .notif-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }
                .notif-row h3 {
                    margin: 0;
                    font-size: 1.1rem;
                }
                .notif-time-tag {
                    font-size: 0.75rem;
                    color: #666;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-weight: 700;
                }
                .notif-details p {
                    color: #aaa;
                    margin: 0 0 1.2rem 0;
                    line-height: 1.5;
                }
                .notif-actions {
                    display: flex;
                    gap: 1rem;
                }
                .notif-btn-main {
                    background: #fbbf24;
                    color: #000;
                    border: none;
                    padding: 6px 16px;
                    font-weight: 800;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    cursor: pointer;
                }
                .notif-btn-mark {
                    background: #333;
                    color: #fff;
                    border: none;
                    padding: 6px 16px;
                    font-weight: 700;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    cursor: pointer;
                }
                .notif-btn-delete {
                    background: transparent;
                    color: #666;
                    border: 1px solid #333;
                    padding: 5px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-left: auto;
                }
                .empty-notif-state {
                    text-align: center;
                    padding: 4rem;
                    color: #555;
                }
            `}</style>
        </div>
    );
};

export default NotificationsPage;
