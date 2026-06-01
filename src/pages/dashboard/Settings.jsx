import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const { pushEnabled, togglePush, addNotification } = useNotifications();
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);

    const handleToggle2FA = () => {
        setTwoFAEnabled(!twoFAEnabled);
        if (addNotification) {
            addNotification({
                title: 'Security Updated',
                message: !twoFAEnabled ? 'Two-Factor Authentication enabled.' : 'Two-Factor Authentication disabled.',
                route: '/dashboard/settings'
            });
        }
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            if (addNotification) {
                addNotification({
                    title: 'Account Deletion',
                    message: 'Account deletion request submitted to support.',
                    route: '/dashboard/settings'
                });
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-8">
                <h2 className="text-xl text-text-secondary font-medium">Manage your account settings</h2>
            </div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
                    <p className="text-text-secondary">Manage your account settings</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Appearance */}
                <Section title="Appearance">
                    <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Theme</span>
                        <div className="flex bg-primary rounded-lg p-1 border border-border">
                            <button
                                onClick={() => theme === 'light' && toggleTheme()}
                                className={`px-4 py-1.5 rounded-md text-sm transition-all ${theme === 'dark' ? 'bg-secondary text-text-primary shadow' : 'text-text-secondary hover:text-text-primary'}`}>
                                Dark
                            </button>
                            <button
                                onClick={() => theme === 'dark' && toggleTheme()}
                                className={`px-4 py-1.5 rounded-md text-sm transition-all ${theme === 'light' ? 'bg-white text-text-primary shadow' : 'text-text-secondary hover:text-text-primary'}`}>
                                Light
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-text-secondary">Language</span>
                        <select className="bg-primary border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none">
                            <option>English</option>
                            <option>Arabic</option>
                            <option>Spanish</option>
                        </select>
                    </div>
                </Section>

                {/* Notifications */}
                <Section title="Notifications">
                    <Toggle 
                        label="Push Notifications" 
                        description="Receive push notifications" 
                        checked={pushEnabled} 
                        onChange={togglePush} 
                    />
                </Section>

                {/* Privacy */}
                <Section title="Privacy & Security">
                    <div className="mt-4">
                        <Toggle label="Two-Factor Authentication" description="Enable 2FA for extra security" checked={twoFAEnabled} onChange={handleToggle2FA} />
                    </div>
                </Section>

                {/* Account Actions */}
                <Section title="Account Actions">
                    <div className="space-y-3">
                        <button 
                            onClick={handleDeleteAccount}
                            className="w-full text-left px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors text-sm font-medium"
                        >
                            Delete Account
                        </button>
                    </div>
                </Section>

            </div>
        </div>
    );
};

const Section = ({ title, children }) => (
    <div className="bg-secondary/50 backdrop-blur border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-text-primary mb-6 border-b border-border pb-2">{title}</h3>
        <div>{children}</div>
    </div>
);

const Toggle = ({ label, description, checked, onChange }) => {
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="text-text-primary text-sm font-medium">{label}</p>
                {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
            </div>
            <button
                onClick={onChange}
                className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-accent border border-transparent' : 'bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/20'}`}
            >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'left-6' : 'left-1'}`}></div>
            </button>
        </div>
    );
};

export default Settings;
