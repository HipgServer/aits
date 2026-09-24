'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  PlusCircle,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Incidents Register', href: '/incidents', icon: ClipboardList },
  { label: 'Employee Master', href: '/employees', icon: Users },
  { label: 'Log Incident', href: '/log', icon: PlusCircle },
  { label: 'Safety Reports', href: '/reports', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white text-slate-800 flex flex-col shrink-0 min-h-screen border-r border-slate-200/80 transition-all duration-300 no-print shadow-sm">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-100 bg-slate-50/50">
        <div className="p-2.5 bg-gradient-to-tr from-sky-600 to-indigo-600 rounded-xl shadow-md shadow-sky-500/20 text-white">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">
            AITS Tracker
          </h1>
          <p className="text-[11px] text-slate-500 font-medium">Workplace Safety Suite</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/20 translate-x-1'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
        <div className="text-[11px] text-slate-600 font-medium">
          System Engine: <span className="text-sky-600 font-semibold">Active & Synced</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">v2.0 • Enterprise Safety System</p>
      </div>
    </aside>
  );
}
