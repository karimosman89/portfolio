import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rss, Copy, Check, FileCode, Newspaper, Radio, Link, ExternalLink, Calendar, User, CornerDownRight } from 'lucide-react';
import { TECHNICAL_BLOGS, PERSONAL_INFO } from '../data';

export default function RSSFeedWidget() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedXML, setCopiedXML] = useState(false);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'reader' | 'xml'>('reader');

  // Generate valid RSS 2.0 XML schema programmatically
  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Sector News &amp; Magazines</title>
    <link>${window.location.origin}</link>
    <description>Daily updated journals, news, and magazines for the AI Sector curated by ${PERSONAL_INFO.name}</description>
    <language>en-us</language>
    <lastBuildDate>Tue, 07 Jul 2026 00:00:00 GMT</lastBuildDate>
    <atom:link href="${window.location.origin}/rss.xml" rel="self" type="application/rss+xml" />
    
    ${TECHNICAL_BLOGS.map(blog => `
    <item>
      <title>${blog.title.replace(/&/g, '&amp;')}</title>
      <link>${window.location.origin}#${blog.id}</link>
      <guid isPermaLink="true">${window.location.origin}#${blog.id}</guid>
      <pubDate>${blog.date}</pubDate>
      <description>${blog.summary.replace(/&/g, '&amp;')}</description>
    </item>`).join('')}
  </channel>
</rss>`;

  const rssFeedUrl = `${window.location.origin}/rss.xml`;

  const copyFeedLink = () => {
    navigator.clipboard.writeText(rssFeedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyXmlContent = () => {
    navigator.clipboard.writeText(rssXml);
    setCopiedXML(true);
    setTimeout(() => setCopiedXML(false), 2000);
  };

  const copyItemLink = (id: string) => {
    const itemUrl = `${window.location.origin}#${id}`;
    navigator.clipboard.writeText(itemUrl);
    setCopiedItemId(id);
    setTimeout(() => setCopiedItemId(null), 2000);
  };

  return (
    <div className="w-full rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xl dark:shadow-none font-sans relative">
      {/* Decorative pulse line */}
      <div className="absolute top-0 right-10 flex h-px w-20">
        <div className="w-full bg-linear-to-r from-transparent via-orange-500/50 to-transparent" />
      </div>

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Rss size={16} className="text-orange-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold">
              XML Syndication Feed
            </span>
          </div>
          <h4 className="font-display font-black text-sm text-zinc-900 dark:text-white tracking-tight mt-1">
            AI Sector News & Magazines Feed
          </h4>
        </div>

        {/* View togglers */}
        <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('reader')}
            className={`cursor-pointer px-3.5 py-1.5 text-[9px] font-mono font-bold uppercase rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'reader'
                ? 'bg-white dark:bg-zinc-800 text-orange-600 dark:text-orange-400 shadow-xs border border-zinc-200/40 dark:border-zinc-700/50'
                : 'text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
            }`}
          >
            <Newspaper size={11} />
            <span>Feed Reader</span>
          </button>
          <button
            onClick={() => setActiveTab('xml')}
            className={`cursor-pointer px-3.5 py-1.5 text-[9px] font-mono font-bold uppercase rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'xml'
                ? 'bg-white dark:bg-zinc-800 text-orange-600 dark:text-orange-400 shadow-xs border border-zinc-200/40 dark:border-zinc-700/50'
                : 'text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
            }`}
          >
            <FileCode size={11} />
            <span>Raw RSS XML</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'reader' ? (
          <motion.div
            key="reader"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Feed URL Copy Bar */}
            <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-orange-50/20 dark:bg-orange-950/5 border border-orange-500/10 dark:border-orange-500/5">
              <div className="flex items-center gap-2 min-w-0">
                <Link size={12} className="text-orange-500 shrink-0" />
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                  {rssFeedUrl}
                </span>
              </div>
              <button
                onClick={copyFeedLink}
                className="cursor-pointer flex items-center gap-1 shrink-0 rounded bg-orange-500 hover:bg-orange-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 transition-colors"
              >
                {copiedLink ? <Check size={11} /> : <Copy size={11} />}
                <span>{copiedLink ? 'Copied' : 'Subscribe'}</span>
              </button>
            </div>

            {/* List of XML feed entries */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {TECHNICAL_BLOGS.map((blog) => (
                <div 
                  key={blog.id}
                  className="p-3 rounded-lg border border-zinc-150 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-950/10 hover:border-orange-500/20 transition-colors duration-200 flex items-start gap-3"
                >
                  <Radio size={14} className="text-orange-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <h5 className="font-display font-extrabold text-xs text-zinc-850 dark:text-zinc-100 hover:text-orange-500 dark:hover:text-orange-400 transition-colors truncate">
                      {blog.title}
                    </h5>
                    <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-light leading-relaxed line-clamp-2">
                      {blog.summary}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[9px] font-mono text-zinc-400 dark:text-zinc-500 pt-1 border-t border-zinc-100 dark:border-zinc-900/50 mt-1.5 pt-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Calendar size={9} />
                        <span>{blog.date}</span>
                        <span>&bull;</span>
                        <User size={9} />
                        <span>Curator: Karim Osman</span>
                      </div>
                      
                      <button
                        onClick={() => copyItemLink(blog.id)}
                        className="cursor-pointer inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 hover:border-orange-500/20 text-zinc-500 hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-400 transition-all duration-200 self-end sm:self-auto"
                        title="Copy direct link to this article"
                      >
                        {copiedItemId === blog.id ? (
                          <>
                            <Check size={9} className="text-emerald-500 animate-scale-up" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Link size={9} />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="xml"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Raw XML Code Inspector Block */}
            <div className="relative">
              <pre className="p-4 rounded-lg bg-zinc-950 border border-zinc-850 overflow-x-auto text-[10px] font-mono text-emerald-400 leading-relaxed max-h-[220px] scrollbar-thin">
                <code>{rssXml}</code>
              </pre>
              
              <button
                onClick={copyXmlContent}
                className="absolute top-2.5 right-2.5 p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Copy entire RSS XML schema to clipboard"
              >
                {copiedXML ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              </button>
            </div>

            <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-mono text-center flex items-center justify-center gap-1">
              <CornerDownRight size={10} className="text-orange-500" />
              <span>Conforms strictly to standard W3C RSS 2.0 specs</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
