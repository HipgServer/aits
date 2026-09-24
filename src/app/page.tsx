'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IncidentType, EmployeeType } from '@/types';
import {
  FileCheck2,
  AlertCircle,
  Sun,
  Moon,
  Calendar,
  Users,
  UserCheck,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<IncidentType[]>([]);
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resInc, resEmp] = await Promise.all([
        fetch('/api/incidents'),
        fetch('/api/employees'),
      ]);
      const dataInc = await resInc.json();
      const dataEmp = await resEmp.json();

      if (dataInc.success) setIncidents(dataInc.data);
      if (dataEmp.success) setEmployees(dataEmp.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalLogs = incidents.length;
  const activeOpened = incidents.filter((i) => i.status === 'Opened').length;
  const dayShift = incidents.filter((i) => i.shift === 'Day').length;
  const nightShift = incidents.filter((i) => i.shift === 'Night').length;

  const currentYear = new Date().getFullYear().toString();
  const filedThisYear = incidents.filter((i) => i.date.slice(0, 4) === currentYear).length;

  // Multi-incident employee counts
  const getEmpIncidentCount = (empId: string) =>
    incidents.filter((i) => i.empId === empId).length;

  const multiIncidentStaff = employees.filter((e) => getEmpIncidentCount(e.id) >= 2).length;

  // Recent 5 incidents
  const recentIncidents = [...incidents]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  // Top employees by event count
  const topEmployees = employees
    .map((e) => ({ emp: e, count: getEmpIncidentCount(e.id) }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxCount = topEmployees[0]?.count || 1;

  const getEmpName = (empId: string) => {
    return employees.find((e) => e.id === empId)?.name || 'Unknown Employee';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 text-white shadow-xl shadow-sky-500/10 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-xs font-bold mb-3 backdrop-blur-md">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300" /> Real-time Operational Risk Oversight
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Safety Intelligence & Incident Dashboard
            </h2>
            <p className="text-sky-100 text-xs mt-1.5 max-w-xl font-medium">
              Monitored workplace incidents, shift analytics, staff safety risk indices, and supporting documents in one place.
            </p>
          </div>
          <Link
            href="/log"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-sky-700 hover:bg-sky-50 font-bold text-xs shadow-lg hover:scale-105 transition-all self-start md:self-auto"
          >
            + File Incident Report <ArrowRight className="w-4 h-4 text-sky-600" />
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="glass-card p-4 rounded-2xl space-y-2 border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Logs</span>
            <FileCheck2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalLogs}</div>
          <p className="text-[10px] text-slate-400 font-medium">All-time recorded</p>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-2 border border-rose-200 bg-rose-50/50">
          <div className="flex items-center justify-between text-rose-600 text-xs font-semibold">
            <span>Active / Open</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700">{activeOpened}</div>
          <p className="text-[10px] text-rose-600/80 font-medium">Pending review</p>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-2 border border-amber-200 bg-amber-50/50">
          <div className="flex items-center justify-between text-amber-600 text-xs font-semibold">
            <span>Day Shift</span>
            <Sun className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700">{dayShift}</div>
          <p className="text-[10px] text-amber-600/80 font-medium">06:00 - 18:00 logs</p>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-2 border border-indigo-200 bg-indigo-50/50">
          <div className="flex items-center justify-between text-indigo-600 text-xs font-semibold">
            <span>Night Shift</span>
            <Moon className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700">{nightShift}</div>
          <p className="text-[10px] text-indigo-600/80 font-medium">18:00 - 06:00 logs</p>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-2 border border-emerald-200 bg-emerald-50/40">
          <div className="flex items-center justify-between text-emerald-600 text-xs font-semibold">
            <span>This Year ({currentYear})</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{filedThisYear}</div>
          <p className="text-[10px] text-emerald-600/80 font-medium">Annual count</p>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-2 border border-amber-200 bg-amber-50/50">
          <div className="flex items-center justify-between text-amber-600 text-xs font-semibold">
            <span>Repeat Multi-Logs</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700">{multiIncidentStaff}</div>
          <p className="text-[10px] text-amber-600/80 font-medium">≥ 2 events staff</p>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-2 border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Staff Roster</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{employees.length}</div>
          <p className="text-[10px] text-slate-400 font-medium">Total registered</p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Incident Feed */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-sky-600" /> Recent Safety Event Reports
            </h3>
            <Link href="/incidents" className="text-xs text-sky-600 font-semibold hover:underline">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400 font-medium">Loading events...</div>
          ) : recentIncidents.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-500">No safety events recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3 hover:border-sky-400 transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {getEmpName(inc.empId).slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {getEmpName(inc.empId)}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-slate-200 text-slate-700 font-semibold">
                          {inc.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                        Cat: {inc.category} • Shift: {inc.shift} • Loc: {inc.location} • {inc.date.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                      inc.status === 'Opened'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : inc.status === 'Under Review'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {inc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Risk Employees */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-600" /> High Frequency Personnel Analytics
            </h3>
            <Link href="/employees" className="text-xs text-amber-600 font-semibold hover:underline">
              View Roster →
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400 font-medium">Loading metrics...</div>
          ) : topEmployees.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-500">No multi-event data available.</p>
          ) : (
            <div className="space-y-4">
              {topEmployees.map(({ emp, count }) => {
                const percentage = Math.round((count / maxCount) * 100);
                return (
                  <div key={emp.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-900 font-bold">{emp.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">({emp.id})</span>
                      </div>
                      <span className="text-rose-600 font-bold">{count} events</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
