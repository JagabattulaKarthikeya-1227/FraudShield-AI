import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Info, Shield, Mail, Monitor, Save, RotateCcw, Building, Briefcase, Hash, Clock, Calendar, CheckCircle, Camera } from 'lucide-react';

export const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    
    return (
        <div className="w-full min-h-[80vh] flex flex-col bg-white text-slate-600 p-4 md:p-8 rounded-2xl font-['Inter'] shadow-sm">
            {/* Header area */}
            <div className="mb-8 mt-2">
                <h1 className="text-3xl font-bold text-slate-900 font-['Space_Grotesk'] mb-2 tracking-tight">Configuration Center</h1>
                <p className="text-slate-600 text-sm">Manage your enterprise preferences, security policies, and system settings.</p>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-2 md:space-x-6 border-b border-slate-200 mb-8 overflow-x-auto pb-0">
                {[
                    { id: 'profile', label: 'Profile', icon: User },
                    { id: 'notifications', label: 'Notifications', icon: Bell },
                    { id: 'about', label: 'About System', icon: Info }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center px-2 md:px-4 py-3 font-medium text-sm transition-colors
                        ${activeTab === tab.id ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-600'}`}
                    >
                        <tab.icon className="w-4 h-4 mr-2" />
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-emerald-600"
                            />
                        )}
                    </button>
                ))}
            </div>
            
            {/* Content */}
            <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                    {activeTab === 'profile' && <ProfileTab key="profile" />}
                    {activeTab === 'notifications' && <NotificationsTab key="notifications" />}
                    {activeTab === 'about' && <AboutTab key="about" />}
                </AnimatePresence>
            </div>
        </div>
    );
};

const ProfileTab = () => {
    const initialData = {
        fullName: 'Loading...',
        email: '...',
        organization: '...',
        role: '...',
        department: '...',
        employeeId: '...',
        phone: '...',
        location: '...'
    };
    
    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [savedData, setSavedData] = useState(initialData);
    
    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { apiClient } = await import('@/core/api/client');
                const response = await apiClient.get('/settings/profile');
                if (response.data.status === 'success') {
                    setFormData(response.data.data);
                    setSavedData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(savedData);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8"
        >
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 flex flex-col items-center shadow-sm backdrop-blur-sm">
                    <div className="relative group cursor-pointer mb-6">
                        <div className="w-32 h-32 rounded-full bg-emerald-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden shadow-lg border-4 border-white">
                            JD
                        </div>
                        <div className="absolute inset-0 bg-slate-800/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">{formData.fullName}</h3>
                    <p className="text-slate-600 text-sm mt-1">{formData.role}</p>
                    <p className="text-slate-500 text-xs mt-1">{formData.organization}</p>
                    
                    <div className="w-full space-y-4 mt-6 pt-6 border-t border-slate-200 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500 flex items-center text-xs font-semibold uppercase tracking-wider"><Clock className="w-3.5 h-3.5 mr-1.5"/> Last Login</span>
                            <span className="font-medium text-slate-600">Today, 09:41 AM</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500 flex items-center text-xs font-semibold uppercase tracking-wider"><Calendar className="w-3.5 h-3.5 mr-1.5"/> Member</span>
                            <span className="font-medium text-slate-600">Oct 2024</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500 flex items-center text-xs font-semibold uppercase tracking-wider"><Briefcase className="w-3.5 h-3.5 mr-1.5"/> Workspace</span>
                            <span className="font-medium text-slate-600 font-['IBM_Plex_Mono'] text-xs bg-slate-50 px-2 py-0.5 rounded">FSA-10248</span>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex items-center px-4 py-1.5 bg-green-500/10 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide border border-green-500/20">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> Active Status
                    </div>
                </div>
            </div>
            
            <div className="lg:col-span-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 shadow-sm backdrop-blur-sm h-full flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 font-['Space_Grotesk']">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                        <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
                        <InputField label="Email Address" name="email" value={formData.email} onChange={handleChange} type="email" />
                        <InputField label="Organization" name="organization" value={formData.organization} onChange={handleChange} />
                        <InputField label="Role" name="role" value={formData.role} onChange={handleChange} />
                        <InputField label="Department" name="department" value={formData.department} onChange={handleChange} />
                        <InputField label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} />
                        <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                        <InputField label="Location" name="location" value={formData.location} onChange={handleChange} />
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end space-x-4 items-center">
                        <button className="px-4 py-2.5 rounded-lg font-medium text-slate-600 text-sm hover:bg-slate-100 transition-colors">
                            Change Password
                        </button>
                        <button className="px-4 py-2.5 rounded-lg font-medium text-slate-600 text-sm hover:bg-slate-100 transition-colors">
                            Cancel
                        </button>
                        <button 
                            disabled={!hasChanges}
                            onClick={async () => {
                                try {
                                    const { apiClient } = await import('@/core/api/client');
                                    await apiClient.put('/settings/profile', formData);
                                    setSavedData(formData);
                                } catch (error) {
                                    console.error("Failed to save profile", error);
                                }
                            }}
                            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm flex items-center
                            ${hasChanges ? 'bg-emerald-600 text-white hover:bg-emerald-600 hover:shadow-md transform hover:-translate-y-0.5' : 'bg-slate-50 text-slate-600 cursor-not-allowed'}`}
                        >
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const InputField = ({ label, name, value, onChange, type = "text" }: any) => {
    return (
        <div className="relative border border-slate-200 rounded-lg px-3 py-1.5 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-all bg-white hover:bg-white">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-transparent text-slate-900 font-medium focus:outline-none text-sm placeholder:text-slate-500"
            />
        </div>
    );
};

const NotificationsTab = () => {
    const defaultPrefs = {
        highRisk: true, suspiciousLogin: true, failedLogin: false, passwordChange: true,
        dailySum: false, weeklyRep: true, monthlyRep: false, aiUpdates: true,
        email: true, push: false, sms: false, desktop: true
    };
    const [preferences, setPreferences] = useState<any>(defaultPrefs);
    const [saved, setSaved] = useState(true);
    const [toast, setToast] = useState(false);
    
    React.useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { apiClient } = await import('@/core/api/client');
                const response = await apiClient.get('/settings/notifications');
                if (response.data.status === 'success') {
                    setPreferences(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };
        fetchNotifications();
    }, []);
    
    const handleToggle = (key: string) => {
        setPreferences((prev: any) => ({...prev, [key]: !prev[key]}));
        setSaved(false);
    };
    
    const handleSave = async () => {
        try {
            const { apiClient } = await import('@/core/api/client');
            await apiClient.put('/settings/notifications', preferences);
            setSaved(true);
            setToast(true);
            setTimeout(() => setToast(false), 3000);
        } catch (error) {
            console.error("Failed to save notifications", error);
        }
    };
    
    const handleReset = () => {
        setPreferences(defaultPrefs);
        setSaved(false);
    };

    const Toggle = ({ label, description, checked, onChange }: any) => (
        <div className="flex items-center justify-between py-4">
            <div className="pr-8">
                <h4 className="font-semibold text-slate-900 text-sm">{label}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
            </div>
            <button 
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${checked ? 'bg-emerald-600' : 'bg-slate-200'}`}
            >
                <motion.span 
                    layout
                    initial={false}
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0`}
                    style={{ x: checked ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </button>
        </div>
    );
    
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] mb-3">Notification Preferences</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Control how and when you receive alerts from FraudShield AI. We recommend keeping security alerts enabled across all active channels to ensure rapid response to potential threats.</p>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    {/* Security Group */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center mb-2 pb-3 border-b border-slate-200">
                            <Shield className="w-5 h-5 mr-3 text-emerald-600" />
                            <h3 className="text-[15px] font-bold text-slate-900 uppercase tracking-wide">Security Notifications</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            <Toggle label="High Risk Transaction Alerts" description="Receive immediate alerts whenever a transaction scores above 85/100 risk." checked={preferences.highRisk} onChange={() => handleToggle('highRisk')} />
                            <Toggle label="Suspicious Login Alerts" description="Get notified of logins from new devices or unusual locations." checked={preferences.suspiciousLogin} onChange={() => handleToggle('suspiciousLogin')} />
                            <Toggle label="Failed Login Attempts" description="Alerts when there are multiple consecutive failed login attempts." checked={preferences.failedLogin} onChange={() => handleToggle('failedLogin')} />
                            <Toggle label="Password Change Alerts" description="Confirmation notifications when your credentials are updated." checked={preferences.passwordChange} onChange={() => handleToggle('passwordChange')} />
                        </div>
                    </div>
                    
                    {/* Reports Group */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center mb-2 pb-3 border-b border-slate-200">
                            <Info className="w-5 h-5 mr-3 text-emerald-600" />
                            <h3 className="text-[15px] font-bold text-slate-900 uppercase tracking-wide">Report Notifications</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            <Toggle label="Daily Summary" description="A morning briefing of the previous day's blocked and flagged transactions." checked={preferences.dailySum} onChange={() => handleToggle('dailySum')} />
                            <Toggle label="Weekly Report" description="Comprehensive weekly analysis of fraud patterns and team performance." checked={preferences.weeklyRep} onChange={() => handleToggle('weeklyRep')} />
                            <Toggle label="Monthly Report" description="High-level executive summary of system effectiveness and ROI." checked={preferences.monthlyRep} onChange={() => handleToggle('monthlyRep')} />
                            <Toggle label="AI Recommendation Updates" description="Get notified when the model suggests rule optimizations." checked={preferences.aiUpdates} onChange={() => handleToggle('aiUpdates')} />
                        </div>
                    </div>
                    
                    {/* Delivery Channels Group */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center mb-2 pb-3 border-b border-slate-200">
                            <Mail className="w-5 h-5 mr-3 text-emerald-600" />
                            <h3 className="text-[15px] font-bold text-slate-900 uppercase tracking-wide">Delivery Channels</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            <Toggle label="Email Notifications" description="Sent to your registered organizational email address." checked={preferences.email} onChange={() => handleToggle('email')} />
                            <Toggle label="Push Notifications" description="Mobile push notifications via the FraudShield Companion App." checked={preferences.push} onChange={() => handleToggle('push')} />
                            <Toggle label="SMS Notifications" description="Urgent text messages for critical security events." checked={preferences.sms} onChange={() => handleToggle('sms')} />
                            <Toggle label="Desktop Notifications" description="Browser-based notifications while you are logged in." checked={preferences.desktop} onChange={() => handleToggle('desktop')} />
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-6">
                        <button onClick={handleReset} className="px-4 py-2.5 rounded-lg font-medium text-sm text-slate-600 hover:bg-slate-100 transition-colors flex items-center">
                            <RotateCcw className="w-4 h-4 mr-2" /> Reset to Default
                        </button>
                        <button 
                            disabled={saved}
                            onClick={handleSave}
                            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center shadow-sm
                            ${!saved ? 'bg-emerald-600 text-white hover:bg-emerald-600 hover:shadow-md transform hover:-translate-y-0.5' : 'bg-slate-50 text-slate-600 cursor-not-allowed'}`}
                        >
                            <Save className="w-4 h-4 mr-2" /> Save Preferences
                        </button>
                    </div>
                </div>
            </div>
            
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center border border-slate-200 z-50"
                    >
                        <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                        <span className="font-medium text-sm">Preferences saved successfully</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const AboutTab = () => {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
        })
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
            <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants} className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:shadow-md transition-all duration-300 backdrop-blur-sm group">
                <div className="flex items-center mb-6">
                    <div className="p-3 bg-emerald-600 rounded-lg mr-4 group-hover:bg-emerald-600 transition-colors">
                        <Shield className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">Application Information</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-sm font-medium">Platform</span>
                        <span className="font-bold text-slate-600 text-sm">FraudShield AI</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-sm font-medium">Version</span>
                        <span className="font-bold text-slate-600 font-['IBM_Plex_Mono'] text-sm">2.5.0 Enterprise</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-sm font-medium">Build Number</span>
                        <span className="font-bold text-slate-600 font-['IBM_Plex_Mono'] text-sm">2026.07</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-sm font-medium">Release Channel</span>
                        <span className="font-bold text-emerald-600 bg-emerald-600 px-2 py-0.5 rounded text-xs">Stable</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm font-medium">License</span>
                        <span className="font-bold text-slate-600 text-sm">Enterprise</span>
                    </div>
                </div>
            </motion.div>
            
            <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants} className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:shadow-md transition-all duration-300 backdrop-blur-sm group">
                <div className="flex items-center mb-6">
                    <div className="p-3 bg-emerald-600 rounded-lg mr-4 group-hover:bg-emerald-600 transition-colors">
                        <Building className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">Workspace Information</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-sm font-medium">Organization</span>
                        <span className="font-bold text-slate-600 text-sm">FraudShield Enterprise</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-sm font-medium">Workspace ID</span>
                        <span className="font-bold text-slate-600 font-['IBM_Plex_Mono'] text-sm bg-slate-100 px-2 py-0.5 rounded">FSA-10248</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-sm font-medium">Subscription</span>
                        <span className="font-bold text-slate-600 text-sm">Enterprise Plan</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm font-medium">Status</span>
                        <span className="font-bold text-green-700 flex items-center text-sm"><span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>Active</span>
                    </div>
                </div>
            </motion.div>
            
            <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants} className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:shadow-md transition-all duration-300 backdrop-blur-sm group">
                <div className="flex items-center mb-6">
                    <div className="p-3 bg-emerald-600 rounded-lg mr-4 group-hover:bg-emerald-600 transition-colors">
                        <Monitor className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">System Health</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-sm font-medium">AI Engine</span>
                        <span className="font-bold text-slate-600 flex items-center text-sm"><CheckCircle className="w-3.5 h-3.5 text-green-500 mr-1.5"/> Operational</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-sm font-medium">Database</span>
                        <span className="font-bold text-slate-600 flex items-center text-sm"><CheckCircle className="w-3.5 h-3.5 text-green-500 mr-1.5"/> Connected</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-sm font-medium">API Gateway</span>
                        <span className="font-bold text-slate-600 flex items-center text-sm"><CheckCircle className="w-3.5 h-3.5 text-green-500 mr-1.5"/> Operational</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-sm font-medium">Model Version</span>
                        <span className="font-bold text-slate-600 font-['IBM_Plex_Mono'] text-sm">v2.4</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm font-medium">Last Synchronization</span>
                        <span className="font-bold text-slate-600 text-sm">2 minutes ago</span>
                    </div>
                </div>
            </motion.div>
            
            <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants} className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:shadow-md transition-all duration-300 backdrop-blur-sm group">
                <div className="flex items-center mb-6">
                    <div className="p-3 bg-emerald-600 rounded-lg mr-4 group-hover:bg-emerald-600 transition-colors">
                        <Hash className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">Developer Information</h3>
                </div>
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-sm font-medium">Support Email</span>
                        <a href="mailto:support@fraudshield.ai" className="font-bold text-emerald-600 hover:underline text-sm">support@fraudshield.ai</a>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-sm font-medium">Documentation</span>
                        <a href="#" className="font-bold text-emerald-600 hover:underline text-sm">docs.fraudshield.ai</a>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-sm font-medium">Version History</span>
                        <a href="#" className="font-bold text-emerald-600 hover:underline text-sm">View Changelog</a>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-sm font-medium">Privacy Policy</span>
                        <a href="#" className="font-bold text-emerald-600 hover:underline text-sm">Read Policy</a>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm font-medium">Terms & Conditions</span>
                        <a href="#" className="font-bold text-emerald-600 hover:underline text-sm">Read Terms</a>
                    </div>
                </div>
                
                <div className="flex flex-col space-y-3">
                    <button className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-600 transition-all shadow-sm hover:shadow-md">
                        Check for Updates
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-100 transition-colors">
                            Download Logs
                        </button>
                        <button className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-100 transition-colors">
                            View Docs
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
