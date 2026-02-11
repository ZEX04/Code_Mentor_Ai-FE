import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();

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
                    <Toggle label="Push Notifications" description="Receive push notifications" defaultChecked />
                    <Toggle label="Email Notifications" description="Receive email updates" defaultChecked />
                    <Toggle label="Weekly Report" description="Get a weekly summary of your progress" />
                </Section>

                {/* Privacy */}
                <Section title="Privacy & Security">
                    <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Profile Visibility</span>
                        <span className="text-sm text-accent bg-accent/10 px-2 py-1 rounded">Public</span>
                    </div>
                    <div className="mt-4">
                        <Toggle label="Two-Factor Authentication" description="Enable 2FA for extra security" />
                    </div>
                </Section>

                {/* Account Actions */}
                <Section title="Account Actions">
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 bg-white/5 rounded-lg text-text-primary hover:bg-white/10 transition-colors text-sm">User Role</button>
                        <button className="w-full text-left px-4 py-3 bg-white/5 rounded-lg text-text-primary hover:bg-white/10 transition-colors text-sm">Your Rights</button>
                        <button className="w-full text-left px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors text-sm font-medium">Delete Account</button>
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

const Toggle = ({ label, description, defaultChecked }) => {
    const [checked, setChecked] = useState(defaultChecked || false);
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="text-text-primary text-sm font-medium">{label}</p>
                {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
            </div>
            <button
                onClick={() => setChecked(!checked)}
                className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-accent border border-transparent' : 'bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/20'}`}
            >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'left-6' : 'left-1'}`}></div>
            </button>
        </div>
    );
};

export default Settings;
