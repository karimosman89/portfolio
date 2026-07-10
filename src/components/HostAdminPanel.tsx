import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ShieldAlert, Key, Settings, RefreshCw, LogIn, LogOut, CheckCircle2, AlertCircle, Trash2, Video, Linkedin, Mail, ExternalLink, Loader2, Save, Sparkles } from 'lucide-react';
import { HostConfig, Meeting } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function HostAdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<HostConfig | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [savingConfig, setSavingConfig] = useState(false);

  // Read auth state on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem('karim_booking_admin_token');
    if (savedToken) {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data if authenticated
  useEffect(() => {
    if (!isAuthenticated || !authToken) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch config
        const configRes = await fetch('/api/booking/config');
        const configData = await configRes.json();
        setConfig(configData);

        // Fetch meetings
        const meetingsRes = await fetch('/api/booking/meetings', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (meetingsRes.status === 403) {
          handleLogout();
          throw new Error('Session expired. Please log in again.');
        }
        const meetingsData = await meetingsRes.json();
        setMeetings(meetingsData);
      } catch (err: any) {
        setError(err.message || 'Error loading dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, authToken]);

  // Handle Admin Passcode Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/booking/host-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const data = await res.json();
      
      if (data.success) {
        sessionStorage.setItem('karim_booking_admin_token', data.token);
        setAuthToken(data.token);
        setIsAuthenticated(true);
        setPasscode('');
      } else {
        setError(data.error || 'Invalid passcode.');
      }
    } catch (err: any) {
      setError('Connection failed. Please check if server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('karim_booking_admin_token');
    setAuthToken(null);
    setIsAuthenticated(false);
    setConfig(null);
    setMeetings([]);
  };

  // Connect Google Calendar
  const handleConnectGoogle = async () => {
    setError(null);
    try {
      const res = await fetch('/api/auth/google/url');
      const data = await res.json();
      
      if (data.simulation) {
        alert("Google Calendar Simulation Mode Active:\n\nBecause GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not set in your environmental secrets yet, the app is running in high-fidelity simulation mode. All scheduling, meet generation, and local conflict resolution will work flawlessly locally inside the container!");
        return;
      }
      
      if (data.url) {
        // Open the authorization URL directly in popup
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        const authWindow = window.open(
          data.url,
          'google_oauth_popup',
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
        );
        
        // Listen for connection success callback
        const checkPopup = setInterval(() => {
          if (!authWindow || authWindow.closed) {
            clearInterval(checkPopup);
            // Refresh config to see if connection status updated
            refreshConfig();
          }
        }, 1000);
      }
    } catch (err) {
      setError('Failed to initiate Google connection.');
    }
  };

  const refreshConfig = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/booking/config');
      const data = await res.json();
      setConfig(data);
    } catch (e) {
      console.error(e);
    }
  };

  // Disconnect Google Calendar
  const handleDisconnectGoogle = async () => {
    if (!confirm("Are you sure you want to disconnect Google Calendar? This will stop syncing new bookings to your calendar.")) {
      return;
    }
    
    setError(null);
    try {
      const res = await fetch('/api/auth/google/disconnect', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Google Calendar disconnected successfully.');
        refreshConfig();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect Google Calendar.');
    }
  };

  // Update Weekly Availability Settings
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config || !authToken) return;
    
    setSavingConfig(true);
    setError(null);
    setSuccess(null);
    
    try {
      const res = await fetch('/api/booking/config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(config)
      });
      
      if (!res.ok) throw new Error('Failed to update config.');
      
      setSuccess('Calendar booking settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Error saving settings.');
    } finally {
      setSavingConfig(false);
    }
  };

  // Delete/Cancel Meeting (with mandatory user confirmation!)
  const handleDeleteMeeting = async (id: string, clientName: string, dateStr: string) => {
    const formattedDate = new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    const confirmed = window.confirm(
      `CRITICAL DESTRUCTIVE ACTION:\n\nAre you sure you want to cancel the meeting with "${clientName}" scheduled for ${formattedDate}?\n\nThis will permanently delete the meeting from your database, and attempt to remove it from your Google Calendar. This action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/booking/meetings/delete', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Meeting cancelled successfully.');
        // Remove from local meetings array
        setMeetings(prev => prev.filter(m => m.id !== id));
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to cancel meeting.');
    }
  };

  // Toggle Day active status
  const toggleDayActive = (dayKey: number) => {
    if (!config) return;
    setConfig({
      ...config,
      weeklyAvailability: {
        ...config.weeklyAvailability,
        [dayKey]: {
          ...config.weeklyAvailability[dayKey],
          active: !config.weeklyAvailability[dayKey].active
        }
      }
    });
  };

  // Update working hours for day
  const updateDayHours = (dayKey: number, field: 'start' | 'end', value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      weeklyAvailability: {
        ...config.weeklyAvailability,
        [dayKey]: {
          ...config.weeklyAvailability[dayKey],
          [field]: value
        }
      }
    });
  };

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-8 font-sans space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Settings size={22} className="animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <h3 className="font-display text-lg font-extrabold text-zinc-900 dark:text-white">
            Host Calendar Panel
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs">
            Authenticate to sync Google Calendar, set availability slots, and oversee booked client meetings.
          </p>
        </div>

        <form onSubmit={handleLogin} className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-950 shadow-sm space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-450 text-xs flex items-center gap-2">
              <ShieldAlert size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
              Admin Access Passcode
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-zinc-400">
                <Key size={14} />
              </span>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded border border-zinc-200 dark:border-zinc-850 pl-9 pr-3 py-2 text-zinc-850 dark:text-zinc-100 bg-zinc-50/20 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
              />
            </div>
            <p className="text-[10px] text-zinc-400 font-mono pt-1">
              Hint: Default passcode is "karim-ai-2026"
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 text-xs transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <LogIn size={14} />}
            <span>Access Host Panel</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="font-sans text-xs space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-extrabold text-zinc-900 dark:text-white uppercase tracking-tight">
              Host Administration Hub
            </h3>
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
              ONLINE
            </span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
            Manage weekly working slots, Google Calendar connection, and view booked client sessions.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 px-3 py-1.5 font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition text-[10px]"
        >
          <LogOut size={12} />
          Sign Out
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-450 rounded-lg flex items-start gap-2">
          <ShieldAlert size={14} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-start gap-2">
          <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Hand: Settings & Availability (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Google Integration Card */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-white dark:bg-zinc-950 space-y-4">
            <h4 className="font-display font-extrabold text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 pb-2 border-b border-zinc-100 dark:border-zinc-900">
              <Calendar size={14} className="text-indigo-600" />
              1. Google Workspace Connection
            </h4>

            {config?.isGoogleConnected ? (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 size={14} />
                    <span>Google Calendar Sync Active</span>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 text-[10px]">
                    Synched Host Account: <span className="font-bold text-zinc-700 dark:text-zinc-300">{config.hostEmail}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDisconnectGoogle}
                  className="rounded border border-rose-200 hover:border-rose-300 dark:border-rose-900 bg-rose-50/40 hover:bg-rose-50 dark:bg-rose-950/10 text-rose-600 dark:text-rose-400 px-3 py-1.5 font-bold transition text-[10px]"
                >
                  Disconnect Account
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60 p-4 rounded-lg">
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-bold">
                    <AlertCircle size={14} />
                    <span>Google Calendar Pending Connection</span>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-450 text-[10px] leading-relaxed">
                    Connecting to Google Calendar enables real-time slot blocking for conflicts AND auto-generation of Google Meet links.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleConnectGoogle}
                  className="rounded bg-indigo-600 hover:bg-indigo-700 hover:scale-101 text-white font-bold px-4 py-2 transition text-[10px] flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw size={12} />
                  Connect Google Calendar
                </button>
              </div>
            )}
          </div>

          {/* Availability Slots Settings */}
          {config && (
            <form onSubmit={handleSaveConfig} className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-white dark:bg-zinc-950 space-y-5">
              <h4 className="font-display font-extrabold text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 pb-2 border-b border-zinc-100 dark:border-zinc-900">
                <Clock size={14} className="text-indigo-600" />
                2. Set Weekly Availability Slots
              </h4>

              <div className="space-y-3.5">
                {Object.keys(config.weeklyAvailability).map(dayKeyStr => {
                  const dayKey = Number(dayKeyStr);
                  const dayInfo = config.weeklyAvailability[dayKey];
                  const active = dayInfo.active;

                  return (
                    <div 
                      key={dayKey} 
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg border transition ${
                        active 
                          ? 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10' 
                          : 'border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/10 dark:bg-zinc-950/10 opacity-60'
                      }`}
                    >
                      {/* Day Label with Checkbox */}
                      <div className="flex items-center gap-2.5 sm:w-28 shrink-0">
                        <input
                          type="checkbox"
                          id={`day-${dayKey}`}
                          checked={active}
                          onChange={() => toggleDayActive(dayKey)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                        />
                        <label htmlFor={`day-${dayKey}`} className="font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                          {dayNames[dayKey]}
                        </label>
                      </div>

                      {/* Hours Input (Visible only if active) */}
                      {active ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={dayInfo.start}
                            onChange={(e) => updateDayHours(dayKey, 'start', e.target.value)}
                            className="rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-1 text-[11px] focus:outline-none focus:border-indigo-500 text-zinc-700 dark:text-zinc-300 font-mono"
                          />
                          <span className="text-zinc-400">to</span>
                          <input
                            type="time"
                            value={dayInfo.end}
                            onChange={(e) => updateDayHours(dayKey, 'end', e.target.value)}
                            className="rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-1 text-[11px] focus:outline-none focus:border-indigo-500 text-zinc-700 dark:text-zinc-300 font-mono"
                          />
                        </div>
                      ) : (
                        <span className="text-[10px] text-zinc-400 font-mono">Not accepting meetings</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Slot Duration, Timezone & Calendly Link Config */}
              <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-bold text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
                      Meeting Slot Duration (Mins)
                    </label>
                    <select
                      value={config.slotDuration}
                      onChange={(e) => setConfig({ ...config, slotDuration: Number(e.target.value) })}
                      className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-1.5 px-2 focus:outline-none focus:border-indigo-500 font-mono text-zinc-700 dark:text-zinc-300"
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={45}>45 Minutes</option>
                      <option value={60}>60 Minutes</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
                      Timezone Context
                    </label>
                    <input
                      type="text"
                      value={config.timezone}
                      onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
                      placeholder="Europe/Rome"
                      className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-1.5 px-2 focus:outline-none focus:border-indigo-500 font-mono text-zinc-750 dark:text-zinc-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-1">
                    <Sparkles size={11} className="text-indigo-500" />
                    Calendly Direct Link (For Embed Integration)
                  </label>
                  <input
                    type="url"
                    value={config.calendlyUrl || ''}
                    onChange={(e) => setConfig({ ...config, calendlyUrl: e.target.value })}
                    placeholder="https://calendly.com/karim-programmer2020"
                    className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-1.5 px-3 focus:outline-none focus:border-indigo-500 font-mono text-[11px] text-zinc-700 dark:text-zinc-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingConfig}
                className="w-full cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 transition flex items-center justify-center gap-1.5 text-xs shadow-sm shadow-indigo-500/10"
              >
                {savingConfig ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>Save Availability Configurations</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Hand: Bookings Dashboard (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-white dark:bg-zinc-950 space-y-4">
            <h4 className="font-display font-extrabold text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 pb-2 border-b border-zinc-100 dark:border-zinc-900">
              <Video size={14} className="text-indigo-600" />
              3. Booked Meetings ({meetings.length})
            </h4>

            <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
              {loading ? (
                <div className="text-center py-12 text-zinc-400 space-y-2">
                  <Loader2 size={20} className="animate-spin mx-auto text-indigo-500" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">Loading Active bookings...</p>
                </div>
              ) : meetings.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 dark:text-zinc-500 space-y-1.5 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                  <Video size={20} className="mx-auto text-zinc-300 dark:text-zinc-700" />
                  <p className="font-semibold">No active meetings scheduled.</p>
                  <p className="text-[10px] text-zinc-400">New bookings will populate here automatically.</p>
                </div>
              ) : (
                meetings.map(meet => {
                  const mTime = new Date(meet.dateTime);
                  return (
                    <div 
                      key={meet.id} 
                      className="border border-zinc-200 dark:border-zinc-850 rounded-lg p-4 bg-zinc-50/20 dark:bg-zinc-950/50 space-y-3 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-800 transition-all duration-150"
                    >
                      {/* Name & Date Header */}
                      <div className="flex justify-between items-start gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2">
                        <div className="space-y-0.5">
                          <span className="font-bold text-[11px] text-zinc-850 dark:text-zinc-100 block">{meet.clientName}</span>
                          <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{meet.subject}</span>
                        </div>
                        <span className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded px-2 py-1 font-mono text-[10px] font-bold shrink-0 text-right">
                          {mTime.toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                          <span className="block font-normal text-[9px] text-zinc-400 mt-0.5">{meet.dateTime.substring(11, 16)}</span>
                        </span>
                      </div>

                      {/* Metadata */}
                      <div className="space-y-1.5 font-sans text-[10px] text-zinc-650 dark:text-zinc-400 leading-normal">
                        <div className="flex items-center gap-1.5">
                          <Mail size={11} className="text-zinc-400" />
                          <a href={`mailto:${meet.clientEmail}`} className="hover:underline hover:text-indigo-600 truncate">{meet.clientEmail}</a>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Linkedin size={11} className="text-[#0a66c2]" />
                          <a href={meet.clientLinkedIn} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-indigo-600 truncate flex items-center gap-0.5">
                            LinkedIn Profile
                            <ExternalLink size={8} />
                          </a>
                        </div>
                        {meet.description && (
                          <div className="bg-zinc-100/50 dark:bg-zinc-900/30 rounded p-2 text-[10px] font-light leading-normal border border-zinc-100 dark:border-zinc-900 italic text-zinc-500">
                            "{meet.description}"
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-1">
                        <a
                          href={meet.googleMeetLink}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          className="flex-1 flex items-center justify-center gap-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-2.5 text-[10px] transition text-center shadow-sm shadow-emerald-500/10"
                        >
                          <Video size={11} />
                          Launch Meet
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteMeeting(meet.id, meet.clientName, meet.dateTime)}
                          className="rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-zinc-550 dark:text-zinc-450 hover:text-rose-600 dark:hover:text-rose-400 px-2.5 py-1.5 transition text-[10px] shrink-0"
                          title="Cancel Meeting"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
