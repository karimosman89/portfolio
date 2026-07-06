import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, Mail, Linkedin, FileText, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, AlertCircle, ExternalLink, Loader2, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Meeting } from '../types';

export default function BookingWidget() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<Meeting | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientLinkedIn: '',
    subject: 'AI Strategy & MLOps Consulting',
    description: ''
  });

  const [touched, setTouched] = useState({
    clientName: false,
    clientEmail: false,
    clientLinkedIn: false,
    subject: false
  });

  const subjects = [
    'AI Strategy & MLOps Consulting',
    'Enterprise RAG & LLMs',
    'Computer Vision / YOLO Project',
    'Hiring / Interview Discussion',
    'General Partnership Inquiry'
  ];

  // Format date to YYYY-MM-DD
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch available slots when date changes
  useEffect(() => {
    if (!selectedDate) return;
    
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedTime(null);
      setError(null);
      
      const dateStr = formatDateString(selectedDate);
      try {
        const response = await fetch(`/api/booking/slots?date=${dateStr}`);
        if (!response.ok) {
          throw new Error('Failed to load slots for selected date.');
        }
        const data = await response.json();
        setAvailableSlots(data.slots || []);
      } catch (err: any) {
        setError(err.message || 'Error querying available slots.');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  // Handle form field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validate fields
  const validateField = (name: string, value: string) => {
    if (name === 'clientName') {
      return !value.trim() ? 'Name is required.' : '';
    }
    if (name === 'clientEmail') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !value.trim() ? 'Email is required.' : !emailRegex.test(value) ? 'Enter a valid email.' : '';
    }
    if (name === 'clientLinkedIn') {
      const isLinkedIn = value.toLowerCase().includes('linkedin.com/');
      return !value.trim() ? 'LinkedIn URL is required for professional validation.' : !isLinkedIn ? 'Must be a valid LinkedIn profile URL.' : '';
    }
    return '';
  };

  const getFormErrors = () => {
    return {
      clientName: touched.clientName ? validateField('clientName', formData.clientName) : '',
      clientEmail: touched.clientEmail ? validateField('clientEmail', formData.clientEmail) : '',
      clientLinkedIn: touched.clientLinkedIn ? validateField('clientLinkedIn', formData.clientLinkedIn) : '',
    };
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Submit booking
  const handleBookMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate everything
    setTouched({
      clientName: true,
      clientEmail: true,
      clientLinkedIn: true,
      subject: true
    });

    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time slot first.');
      return;
    }

    const errors = {
      clientName: validateField('clientName', formData.clientName),
      clientEmail: validateField('clientEmail', formData.clientEmail),
      clientLinkedIn: validateField('clientLinkedIn', formData.clientLinkedIn)
    };

    if (errors.clientName || errors.clientEmail || errors.clientLinkedIn) {
      setError('Please fix any validation issues in the form.');
      return;
    }

    setBookingLoading(true);

    try {
      const payload = {
        date: formatDateString(selectedDate),
        time: selectedTime,
        ...formData
      };

      const response = await fetch('/api/booking/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to complete booking.');
      }

      const resData = await response.json();
      setBookingSuccess(resData.meeting);
    } catch (err: any) {
      setError(err.message || 'An error occurred while booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Render Custom Calendar
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Padding for previous month's days
    const startingDayOfWeek = firstDay.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const paddingCount = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1; // Map to Mon-Sun
    
    for (let i = paddingCount; i > 0; i--) {
      days.push(new Date(year, month, 1 - i));
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date.getTime() < today.getTime();
  };

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const formErrors = getFormErrors();

  if (bookingSuccess) {
    const meetTime = new Date(bookingSuccess.dateTime);
    return (
      <motion.div
        key="booking-success"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 px-4 font-sans space-y-6"
      >
        <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <CheckCircle2 size={32} />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-display text-xl font-extrabold text-zinc-900 dark:text-white">
            Meeting Confirmed!
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-md mx-auto">
            Your live AI strategy consultation with Karim Osman has been successfully booked on his Google Calendar and yours! An automated invitation has been sent to your inbox.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 text-left text-xs space-y-4">
          <div className="flex justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
            <span className="text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono font-bold text-[9px]">Topic</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-150">{bookingSuccess.subject}</span>
          </div>
          
          <div className="flex justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
            <span className="text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono font-bold text-[9px]">Date &amp; Time</span>
            <span className="font-semibold text-zinc-850 dark:text-zinc-150 flex items-center gap-1.5">
              <Clock size={12} className="text-indigo-500" />
              {meetTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {bookingSuccess.dateTime.substring(11, 16)} ({bookingSuccess.duration} mins)
            </span>
          </div>

          <div className="space-y-2 pt-1">
            <span className="text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono font-bold text-[9px] block">Google Meet Video Link</span>
            <a 
              href={bookingSuccess.googleMeetLink} 
              target="_blank" 
              referrerPolicy="no-referrer"
              className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100/60 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 rounded-lg p-3 transition-colors border border-indigo-100/50 dark:border-indigo-900/30"
            >
              <span className="font-mono truncate mr-2">{bookingSuccess.googleMeetLink}</span>
              <ExternalLink size={14} className="shrink-0" />
            </a>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
          <a
            href="https://www.linkedin.com/in/karimosman89/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded bg-[#0a66c2] hover:bg-[#004182] text-white py-2.5 px-4 font-bold text-xs transition"
          >
            <Linkedin size={14} />
            Connect on LinkedIn
          </a>
          <button
            onClick={() => {
              setBookingSuccess(null);
              setSelectedDate(null);
              setSelectedTime(null);
              setFormData({
                clientName: '',
                clientEmail: '',
                clientLinkedIn: '',
                subject: 'AI Strategy & MLOps Consulting',
                description: ''
              });
            }}
            className="rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 py-2.5 px-4 font-semibold text-zinc-700 dark:text-zinc-300 text-xs transition"
          >
            Book Another Meeting
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="font-sans text-xs grid gap-8 md:grid-cols-12">
      {/* Step 1: Calendar & Slots (5 columns) */}
      <div className="md:col-span-5 space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1.5">
            <CalendarIcon size={12} className="text-indigo-600" />
            1. Select Calendar Date
          </label>
          <div className="rounded border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/20 dark:bg-zinc-950/10">
            {/* Calendar Header */}
            <div className="flex items-center justify-between pb-3">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Days Of Week Headers */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono font-bold text-[9px] text-zinc-400 dark:text-zinc-500 pb-2 border-b border-zinc-200/50 dark:border-zinc-800/40">
              {daysOfWeek.map((day, idx) => (
                <div key={idx}>{day}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 pt-2">
              {getDaysInMonth(currentMonth).map((date, idx) => {
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                const past = isPast(date);
                const selected = isSelected(date);
                const weekend = date.getDay() === 0 || date.getDay() === 6;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={past || !isCurrentMonth}
                    onClick={() => setSelectedDate(date)}
                    className={`h-7 w-full flex items-center justify-center rounded text-[11px] font-medium transition-all ${
                      !isCurrentMonth
                        ? 'text-zinc-300 dark:text-zinc-700 pointer-events-none'
                        : past
                        ? 'text-zinc-300 dark:text-zinc-700 line-through pointer-events-none'
                        : selected
                        ? 'bg-indigo-600 text-white font-bold scale-105 shadow-md shadow-indigo-500/20'
                        : isToday(date)
                        ? 'border border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : weekend
                        ? 'text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        : 'text-zinc-750 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Slots Panel */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1.5">
            <Clock size={12} className="text-indigo-600" />
            2. Choose Time Slot
          </label>
          <div className="rounded border border-zinc-200 dark:border-zinc-800 p-4 min-h-[110px] bg-zinc-50/20 dark:bg-zinc-950/10 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {!selectedDate ? (
                <div className="text-center text-zinc-400 dark:text-zinc-500 py-6 font-mono text-[10px]">
                  Please select a date on the calendar.
                </div>
              ) : loadingSlots ? (
                <div className="flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400 py-6 space-y-2">
                  <Loader2 size={18} className="animate-spin text-indigo-500" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">Consulting Live Availability...</span>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center text-rose-500/80 dark:text-rose-450/80 py-4 space-y-1">
                  <AlertCircle size={16} className="mx-auto" />
                  <p className="font-semibold">No slots available on this date.</p>
                  <p className="text-[9px] text-zinc-400">Karim is fully booked or inactive on this date.</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-3 gap-2"
                >
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 rounded border text-center transition-all duration-150 ${
                        selectedTime === slot
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold scale-102 shadow-sm'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Step 2: Form Details (7 columns) */}
      <form onSubmit={handleBookMeeting} className="md:col-span-7 space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1.5">
          <User size={12} className="text-indigo-600" />
          3. Provide Booking Details
        </label>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1">
            <label className="font-bold text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
              Your Name *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-zinc-400">
                <User size={14} />
              </span>
              <input
                type="text"
                name="clientName"
                required
                value={formData.clientName}
                onChange={handleChange}
                onBlur={() => handleBlur('clientName')}
                placeholder="Jane Doe"
                className={`w-full rounded border pl-9 pr-3 py-2 text-zinc-800 dark:text-zinc-100 focus:outline-none transition ${
                  formErrors.clientName
                    ? 'border-rose-500 bg-rose-50/5'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900'
                }`}
              />
              {formErrors.clientName && (
                <span className="text-[10px] text-rose-500 font-mono mt-0.5 block">{formErrors.clientName}</span>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="font-bold text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
                Email Address *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-400">
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  name="clientEmail"
                  required
                  value={formData.clientEmail}
                  onChange={handleChange}
                  onBlur={() => handleBlur('clientEmail')}
                  placeholder="jane@example.com"
                  className={`w-full rounded border pl-9 pr-3 py-2 text-zinc-800 dark:text-zinc-100 focus:outline-none transition ${
                    formErrors.clientEmail
                      ? 'border-rose-500 bg-rose-50/5'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900'
                  }`}
                />
                {formErrors.clientEmail && (
                  <span className="text-[10px] text-rose-500 font-mono mt-0.5 block">{formErrors.clientEmail}</span>
                )}
              </div>
            </div>

            {/* LinkedIn Field */}
            <div className="space-y-1">
              <label className="font-bold text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-1">
                <Linkedin size={10} className="text-[#0a66c2]" />
                LinkedIn Profile *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-400">
                  <Linkedin size={14} />
                </span>
                <input
                  type="url"
                  name="clientLinkedIn"
                  required
                  value={formData.clientLinkedIn}
                  onChange={handleChange}
                  onBlur={() => handleBlur('clientLinkedIn')}
                  placeholder="https://linkedin.com/in/username"
                  className={`w-full rounded border pl-9 pr-3 py-2 text-zinc-800 dark:text-zinc-100 focus:outline-none transition ${
                    formErrors.clientLinkedIn
                      ? 'border-rose-500 bg-rose-50/5'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900'
                  }`}
                />
                {formErrors.clientLinkedIn && (
                  <span className="text-[10px] text-rose-500 font-mono mt-0.5 block">{formErrors.clientLinkedIn}</span>
                )}
              </div>
            </div>
          </div>

          {/* Subject Field */}
          <div className="space-y-1">
            <label className="font-bold text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
              Inquiry Profile *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-zinc-400">
                <FileText size={14} />
              </span>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded border pl-9 pr-3 py-2 text-zinc-800 dark:text-zinc-100 bg-zinc-50/20 dark:bg-zinc-900 focus:outline-none transition border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:bg-white"
              >
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-1">
            <label className="font-bold text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
              Agenda / Meeting Notes (Optional)
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a brief background on your project or what you would like to discuss so Karim can prepare accordingly."
              className="w-full rounded border px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none transition border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900 font-sans"
            />
          </div>
        </div>
        
        {/* Automated Google Meet Notice */}
        <div className="rounded border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 px-4 py-3 flex items-start gap-3 mt-4">
          <Video size={16} className="text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 font-mono tracking-wider uppercase mb-1">Automated Google Meet Video Conferencing</h4>
            <p className="text-[10px] text-indigo-700/80 dark:text-indigo-400/80 leading-relaxed font-mono">
              Upon confirming this booking, a secure Google Meet video conferencing link will be automatically generated and included in your event invitation metadata.
            </p>
          </div>
        </div>

        {/* Submit Booking Button */}
        <button
          type="submit"
          disabled={bookingLoading || !selectedDate || !selectedTime}
          className="w-full cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 dark:disabled:text-zinc-600 text-white py-3 px-4 font-bold transition flex items-center justify-center gap-2 mt-4"
        >
          {bookingLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Finalizing Google Calendar Reservation...</span>
            </>
          ) : (
            <>
              <Sparkles size={14} />
              <span>
                {selectedDate && selectedTime 
                  ? `Book Meeting on ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${selectedTime}`
                  : 'Select Date & Time to Complete'
                }
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
