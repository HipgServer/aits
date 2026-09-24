'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Sun, Moon, Clock, Database } from 'lucide-react';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [dbSource, setDbSource] = useState<'mongodb' | 'memory'>('memory');

  useEffect(() => {
    // Check initial dark mode preference
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString());

    fetch('/api/employees')
      .then((res) => res.json())
      .then((data) => {
        if (data.source === 'mongodb') {
          setDbSource('mongodb');
        } else {
          setDbSource('memory');
        }
      })
      .catch(() => setDbSource('memory'));

    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 transition-colors no-print shadow-xs">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            Accident & Incident Tracking System
            {dbSource === 'mongodb' ? (
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-1 shadow-2xs">
                <Database className="w-3 h-3 text-emerald-600" /> MongoDB Active
              </span>
            ) : (
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-sky-50 text-sky-700 rounded-full border border-sky-200 flex items-center gap-1 shadow-2xs">
                <Database className="w-3 h-3 text-sky-600" /> Memory Mode Active
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Workplace Safety & Risk Management Suite
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Realtime Clock */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-semibold border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-sky-600" />
          <span>{currentTime || '00:00:00'}</span>
        </div>

        {/* Log Incident Quick Button */}
        <Link
          href="/log"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 hover:opacity-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Incident</span>
        </Link>
      </div>
    </header>
  );
}

