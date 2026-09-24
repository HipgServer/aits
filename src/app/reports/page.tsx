'use client';

import React, { useEffect, useState } from 'react';
import { IncidentType, EmployeeType } from '@/types';
import {
  Printer,
  Download,
  Calendar,
  BarChart3,
  Sun,
  Moon,
  Layers,
  CheckCircle,
} from 'lucide-react';

export default function ReportsPage() {
  const [incidents, setIncidents] = useState<IncidentType[]>([]);
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch('/api/incidents'), fetch('/api/employees')])
      .then(async ([resInc, resEmp]) => {
        const dataInc = await resInc.json();
        const dataEmp = await resEmp.json();
        if (dataInc.success) setIncidents(dataInc.data);
        if (dataEmp.success) setEmployees(dataEmp.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const yearsSet = new Set(incidents.map((i) => i.date.slice(0, 4)));
  yearsSet.add(new Date().getFullYear().toString());
  const yearsList = Array.from(yearsSet).sort((a, b) => b.localeCompare(a));

  const filteredIncidents = selectedYear
    ? incidents.filter((i) => i.date.slice(0, 4) === selectedYear)
    : incidents;

  const total = filteredIncidents.length || 1;

  // Shift Breakdown
  const shiftMetrics = {
    Day: filteredIncidents.filter((i) => i.shift === 'Day').length,
    Night: filteredIncidents.filter((i) => i.shift === 'Night').length,
  };

  // Type Breakdown
  const typeMetrics: Record<string, number> = {
    Accident: 0,
    Incident: 0,
    Injury: 0,
    'Near Miss': 0,
  };
  filteredIncidents.forEach((i) => {
    if (typeMetrics[i.type] !== undefined) typeMetrics[i.type]++;
  });

  // Category Breakdown
  const catMetrics: Record<string, number> = {
    'Ro Ro': 0,
    Container: 0,
    Fire: 0,
    Construction: 0,
    Others: 0,
  };
  filteredIncidents.forEach((i) => {
    if (catMetrics[i.category] !== undefined) catMetrics[i.category]++;
  });

  const getEmp = (empId: string) => {
    return (
      employees.find((e) => e.id === empId) || {
        name: 'Unknown Employee',
        employer: '—',
      }
    );
  };

  const handleExportCSV = () => {
    const headers = [
      'Incident ID',
      'Date',
      'Time',
      'Employee Name',
      'Emp No',
      'ID Card Number',
      'Employer Name',
      'Department',
      'Role Designation',
      'Incident Type',
      'Incident Category',
      'Shift Pattern',
      'Location',
      'Equipment Details',
      'Injury Details',
      'Body Part Affected',
      'Description Summary',
      'Workflow Status',
    ];

    const rows = filteredIncidents.map((i) => {
      const e = getEmp(i.empId);
      return [
        i.id,
        i.date.slice(0, 10),
        i.date.slice(11, 16),
        e.name,
        i.empId,
        (e as EmployeeType).idnum || '—',
        e.employer,
        (e as EmployeeType).dept || '—',
        (e as EmployeeType).role || '—',
        i.type,
        i.category,
        i.shift,
        i.location,
        i.equipment || 'None',
        i.injury || 'None',
        i.bodypart || '',
        i.desc,
        i.status,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Safety_Ledger_Report_${selectedYear || 'All_Time'}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Safety Ledger Analytics & Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Statistical breakdown of workplace events, shift metrics, CSV export, and print ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <label className="text-slate-500 font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-600" /> Year:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
            >
              <option value="">All Eras</option>
              {yearsList.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4" /> Print Ledger
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:opacity-95 transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Report Header for Print */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
        <h3 className="font-bold text-sm text-slate-900">
          Safety Incident Analytics Compendium Report — {selectedYear || 'All Historic Eras'}
        </h3>
        <p className="text-slate-500 mt-0.5 font-medium">
          Report Clock: {new Date().toLocaleString()} • Filtered Dataset: {filteredIncidents.length} logs counted
        </p>
      </div>

      {/* Shift Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-1">
          <div className="flex items-center justify-between text-xs text-amber-600 font-bold">
            <span>Day Shift Events</span>
            <Sun className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-amber-700">
            {shiftMetrics.Day}
          </div>
          <p className="text-[10px] text-amber-600/80 font-medium">06:00 - 18:00 logs</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-indigo-200 bg-indigo-50/50 space-y-1">
          <div className="flex items-center justify-between text-xs text-indigo-600 font-bold">
            <span>Night Shift Events</span>
            <Moon className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-indigo-700">
            {shiftMetrics.Night}
          </div>
          <p className="text-[10px] text-indigo-600/80 font-medium">18:00 - 06:00 logs</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-sky-200 bg-sky-50/50 space-y-1">
          <div className="flex items-center justify-between text-xs text-sky-600 font-bold">
            <span>Sum Total Logs</span>
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-sky-700">
            {filteredIncidents.length}
          </div>
          <p className="text-[10px] text-sky-600/80 font-medium">In selected timeframe</p>
        </div>
      </div>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Classification Breakdown */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm bg-white">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-600" /> Distribution By Event Classification Type
          </h3>
          <div className="space-y-3 text-xs">
            {Object.entries(typeMetrics).map(([t, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={t} className="space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-700">{t}</span>
                    <span className="text-sky-600 font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational Category Breakdown */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm bg-white">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-600" /> Distribution By Operational Risk Category
          </h3>
          <div className="space-y-3 text-xs">
            {Object.entries(catMetrics).map(([cat, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-700">{cat}</span>
                    <span className="text-amber-600 font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* All Incidents Table */}
      <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">
            All Incidents Ledger Table ({filteredIncidents.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">ID</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Employee</th>
                <th className="py-2.5 px-4">Employer</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Shift</th>
                <th className="py-2.5 px-4">Equipment</th>
                <th className="py-2.5 px-4">Location</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredIncidents.map((inc) => {
                const emp = getEmp(inc.empId);
                return (
                  <tr key={inc.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-sky-600">{inc.id}</td>
                    <td className="py-2.5 px-4 text-slate-700">{inc.date.slice(0, 10)}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{emp.name}</td>
                    <td className="py-2.5 px-4 text-slate-600 font-medium">{emp.employer}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{inc.type}</td>
                    <td className="py-2.5 px-4 text-slate-700">{inc.category}</td>
                    <td className="py-2.5 px-4">{inc.shift}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-600">{inc.equipment || 'None'}</td>
                    <td className="py-2.5 px-4 text-slate-700">{inc.location}</td>
                    <td className="py-2.5 px-4 font-bold">{inc.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
