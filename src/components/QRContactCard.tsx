import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, User, Mail, Phone, MapPin, Download, Check, Share2, Eye, ShieldCheck, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO } from '../data';

export default function QRContactCard() {
  const [activeTab, setActiveTab] = useState<'card' | 'qr'>('card');
  const [copied, setCopied] = useState(false);

  // Generate a valid vCard format for smartphone scanners
  const vCardString = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${PERSONAL_INFO.name}`,
    `TITLE:${PERSONAL_INFO.title}`,
    'ORG:AI Engineering & Machine Learning Advisory',
    `TEL;TYPE=CELL,VOICE:${PERSONAL_INFO.phoneItaly}`,
    `TEL;TYPE=WORK,WhatsApp:${PERSONAL_INFO.phoneWhatsapp}`,
    `EMAIL;TYPE=PREF,INTERNET:${PERSONAL_INFO.email}`,
    `URL:${window.location.origin}`,
    `ADR:;;${PERSONAL_INFO.location};;;;`,
    'REV:2026-07-07T00:00:00Z',
    'END:VCARD'
  ].join('\n');

  // Generate QR Code URL using a secure, free global API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(vCardString)}&color=09090b&bgcolor=ffffff&qzone=1`;

  const handleCopyVCard = () => {
    navigator.clipboard.writeText(vCardString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadVCard = () => {
    const element = document.createElement("a");
    const file = new Blob([vCardString], { type: 'text/vcard' });
    element.href = URL.createObjectURL(file);
    element.download = `${PERSONAL_INFO.name.replace(/\s+/g, '_')}_contact.vcf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xl dark:shadow-none font-sans relative">
      {/* Background Decorative Patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 dark:emerald-500/10 rounded-full blur-xl pointer-events-none" />

      {/* Header and Mode Selector */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <QrCode size={16} className="text-indigo-600 dark:text-indigo-400" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold">
            Interactive QR Card
          </span>
        </div>
        
        {/* Toggle Controls */}
        <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('card')}
            className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded-md transition-all cursor-pointer ${
              activeTab === 'card'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-zinc-200/40 dark:border-zinc-700/50'
                : 'text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
            }`}
          >
            Info Card
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded-md transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-zinc-200/40 dark:border-zinc-700/50'
                : 'text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
            }`}
          >
            Scan QR
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'card' ? (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Business Card Layout */}
            <div className="p-4.5 rounded-lg border border-zinc-200/60 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-display font-black text-zinc-900 dark:text-white text-base tracking-tight">
                    {PERSONAL_INFO.name}
                  </h4>
                  <p className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mt-0.5">
                    {PERSONAL_INFO.title}
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <User size={14} />
                </div>
              </div>

              <div className="space-y-2 border-t border-zinc-200/60 dark:border-zinc-800/80 pt-3 text-[11px] text-zinc-600 dark:text-zinc-350 font-mono">
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
                  <span className="truncate">{PERSONAL_INFO.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
                  <span>{PERSONAL_INFO.phoneItaly}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
                  <span className="truncate">{PERSONAL_INFO.location}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={downloadVCard}
                className="cursor-pointer flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-2.5 text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Download size={12} />
                <span>Save Contact</span>
              </button>
              
              <button
                onClick={handleCopyVCard}
                className="cursor-pointer flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-2.5 text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {copied ? <Check size={12} className="text-emerald-500" /> : <Share2 size={12} />}
                <span>{copied ? 'Copied' : 'Copy vCard'}</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="qr"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center space-y-4"
          >
            {/* Scannable Code Area */}
            <div className="relative p-3 bg-white rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-inner flex items-center justify-center">
              <img
                src={qrCodeUrl}
                alt={`${PERSONAL_INFO.name} vCard QR Code`}
                className="h-44 w-44 object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-indigo-500/0 hover:bg-indigo-500/5 transition-colors rounded-lg flex items-center justify-center group pointer-events-none">
                <span className="opacity-0 group-hover:opacity-100 text-[10px] font-mono uppercase tracking-widest bg-zinc-900 text-white px-2 py-1 rounded shadow transition-opacity">
                  vCard Scanner Ready
                </span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-[11px] font-bold text-zinc-850 dark:text-zinc-200 flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span>Instant Contact Sync</span>
              </p>
              <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-light max-w-xs leading-relaxed">
                Scan with your phone's camera to immediately add Karim to your secure address book.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
