import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from './theme';
import Background from './components/Background';
import { CursorGlow } from './components/ui';
import Header from './components/Header';

// Below-the-fold sections are code-split to keep the initial payload small.
const Services = lazy(() => import('./components/Services'));
const AgentsShowcase = lazy(() => import('./components/AgentsShowcase'));
const Stats = lazy(() => import('./components/Stats'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const ExperienceTimeline = lazy(() => import('./components/ExperienceTimeline'));
const Blog = lazy(() => import('./components/Blog'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const QuickChat = lazy(() => import('./components/QuickChat'));
const Footer = lazy(() => import('./components/Footer'));

const Fallback = () => <div className="py-24 text-center text-[var(--text-muted)]" aria-hidden="true" />;

export default function App() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen font-sans text-[var(--text)]">
        <Background />
        <CursorGlow />

        <main className="relative z-10">
          <Header />
          <Suspense fallback={<Fallback />}>
            <Services />
            <AgentsShowcase />
            <Stats />
            <Skills />
            <Projects />
            <Testimonials />
            <ExperienceTimeline />
            <Blog />
            <ContactForm />
          </Suspense>
        </main>

        <Suspense fallback={null}>
          <Footer />
          <QuickChat />
        </Suspense>
      </div>
    </ThemeProvider>
  );
}
