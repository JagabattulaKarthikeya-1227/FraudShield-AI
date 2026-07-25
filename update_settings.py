import re

with open('frontend/src/pages/SettingsPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace bg-white/40 with bg-[#748092]/20
content = content.replace('bg-white/40', 'bg-[#748092]/20')

# Update ProfileTab
profile_tab_new = '''
const ProfileTab = () => {
    const [initialData, setInitialData] = useState({
        fullName: 'Loading...',
        email: '...',
        organization: '...',
        role: '...',
        department: '...',
        employeeId: '...',
        phone: '...',
        location: '...'
    });
    
    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    
    // Add import dynamically in the file later
    
    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Dynamic import just for safety, or we can use the top level import
                const { apiClient } = await import('@/core/api/client');
                const response = await apiClient.get('/settings/profile');
                if (response.data.status === 'success') {
                    setInitialData(response.data.data);
                    setFormData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSave = async () => {
        try {
            const { apiClient } = await import('@/core/api/client');
            await apiClient.put('/settings/profile', formData);
            setInitialData(formData);
            // Optionally add toast here
        } catch (error) {
            console.error("Failed to save profile", error);
        }
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-64 text-[#124E66]">Loading profile...</div>;
    }
'''

# Find the ProfileTab definition and replace its start
profile_tab_regex = re.compile(r'const ProfileTab = \(\) => \{.*?(?=return \()', re.DOTALL)
content = profile_tab_regex.sub(profile_tab_new, content)

# Also update the Save Changes button in ProfileTab
save_button_regex = re.compile(r'(<button\s+disabled=\{!hasChanges\}\s+)(className=\{[^]+\}\s+>)(.*?)(</button>)', re.DOTALL)

def save_btn_repl(m):
    return m.group(1) + 'onClick={handleSave}\n                            ' + m.group(2) + m.group(3) + m.group(4)

# We need to only replace the first occurrence (in ProfileTab)
content = content[:content.find('const NotificationsTab')] = save_button_regex.sub(save_btn_repl, content[:content.find('const NotificationsTab')]) + content[content.find('const NotificationsTab'):]


# Update NotificationsTab
notifications_tab_new = '''
const NotificationsTab = () => {
    const defaultPrefs = {
        securityAlerts: true, suspiciousLogin: true, failedLogin: false, passwordChange: true,
        dailySum: false, weeklyRep: true, monthlyRep: true, aiUpdates: true,
        email: true, push: false, sms: false, desktop: true
    };
    const [preferences, setPreferences] = useState<any>(defaultPrefs);
    const [saved, setSaved] = useState(true);
    const [toast, setToast] = useState(false);
    const [loading, setLoading] = useState(true);
    
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
            } finally {
                setLoading(false);
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

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-[#124E66]">Loading preferences...</div>;
    }
'''

notif_tab_regex = re.compile(r'const NotificationsTab = \(\) => \{.*?(?=const Toggle =)', re.DOTALL)
content = notif_tab_regex.sub(notifications_tab_new, content)


with open('frontend/src/pages/SettingsPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
