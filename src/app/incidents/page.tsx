'use client';

import React, { useEffect, useState } from 'react';
import { IncidentType, EmployeeType, DocumentItemType } from '@/types';
import IncidentModal from '@/components/IncidentModal';
import IncidentEditModal from '@/components/IncidentEditModal';
import {
  Search,
  Filter,
  Eye,
  Paperclip,
  Trash2,
  Plus,
  RefreshCw,
  Pencil,
  ShieldAlert,
  Calendar,
  User,
  Clock,
  MapPin,
  Activity,
  Layers,
  Sparkles,
  FileSpreadsheet,
  IdCard,
} from 'lucide-react';
import Link from 'next/link';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<IncidentType[]>([]);
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterShift, setFilterShift] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Selected Incident for Detail Modal & Edit Modal
  const [selectedIncident, setSelectedIncident] = useState<IncidentType | null>(null);
  const [editingIncident, setEditingIncident] = useState<IncidentType | null>(null);

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
      console.error('Error fetching incidents data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getEmp = (empId: string) => {
    return (
      employees.find((e) => e.id === empId) || {
        id: empId,
        idnum: '—',
        name: 'Unknown Employee',
        employer: '—',
        role: '—',
        dept: '—',
      }
    );
  };

  // Get list of unique years
  const yearsSet = new Set(incidents.map((i) => i.date.slice(0, 4)));
  yearsSet.add(new Date().getFullYear().toString());
  const yearsList = Array.from(yearsSet).sort((a, b) => b.localeCompare(a));

  // Filtered Incidents
  const filteredIncidents = incidents
    .filter((inc) => {
      const emp = getEmp(inc.empId);
      if (filterYear && inc.date.slice(0, 4) !== filterYear) return false;
      if (filterShift && inc.shift !== filterShift) return false;
      if (filterStatus && inc.status !== filterStatus) return false;
      if (filterType && inc.type !== filterType) return false;
      if (filterCategory && inc.category !== filterCategory) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const fullText = [
          inc.id,
          emp.name,
          emp.id,
          emp.idnum,
          emp.employer,
          inc.type,
          inc.category,
          inc.location,
          inc.status,
          inc.equipment,
        ]
          .join(' ')
          .toLowerCase();

        if (!fullText.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/incidents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setIncidents((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
        );
        if (selectedIncident?.id === id) {
          setSelectedIncident({ ...selectedIncident, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleAddDoc = async (incId: string, doc: DocumentItemType) => {
    const inc = incidents.find((i) => i.id === incId);
    if (!inc) return;

    const updatedDocs = [...(inc.docs || []), doc];
    try {
      const res = await fetch(`/api/incidents/${incId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docs: updatedDocs }),
      });
      const data = await res.json();
      if (data.success) {
        setIncidents((prev) =>
          prev.map((i) => (i.id === incId ? { ...i, docs: updatedDocs } : i))
        );
        if (selectedIncident?.id === incId) {
          setSelectedIncident({ ...selectedIncident, docs: updatedDocs });
        }
      }
    } catch (err) {
      console.error('Failed to attach document:', err);
    }
  };

  const handleRemoveDoc = async (incId: string, docIndex: number) => {
    const inc = incidents.find((i) => i.id === incId);
    if (!inc || !inc.docs) return;

    const updatedDocs = inc.docs.filter((_, idx) => idx !== docIndex);
    try {
      const res = await fetch(`/api/incidents/${incId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docs: updatedDocs }),
      });
      const data = await res.json();
      if (data.success) {
        setIncidents((prev) =>
          prev.map((i) => (i.id === incId ? { ...i, docs: updatedDocs } : i))
        );
        if (selectedIncident?.id === incId) {
          setSelectedIncident({ ...selectedIncident, docs: updatedDocs });
        }
      }
    } catch (err) {
      console.error('Failed to remove document:', err);
    }
  };

  const handleSaveEditIncident = async (updatedInc: IncidentType) => {
    try {
      const res = await fetch(`/api/incidents/${updatedInc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInc),
      });
      const data = await res.json();
      if (data.success) {
        setIncidents((prev) =>
          prev.map((i) => (i.id === updatedInc.id ? { ...i, ...updatedInc } : i))
        );
        if (selectedIncident?.id === updatedInc.id) {
          setSelectedIncident({ ...selectedIncident, ...updatedInc });
        }
      } else {
        alert(data.error || 'Failed to update incident.');
      }
    } catch (err) {
      console.error('Failed to update incident:', err);
    }
  };

  const handleDeleteIncident = async (id: string) => {
    if (!confirm(`Purge safety incident record ${id} permanently?`)) return;
    try {
      const res = await fetch(`/api/incidents/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setIncidents((prev) => prev.filter((i) => i.id !== id));
        if (selectedIncident?.id === id) setSelectedIncident(null);
      }
    } catch (err) {
      console.error('Failed to delete incident:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Title & CTA Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white border border-slate-200 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-tr from-sky-600 to-indigo-600 text-white rounded-2xl shadow-md shadow-sky-500/20">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              Incidents Master Register
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Complete database of workplace safety logs, status tracking, and supporting PDF files.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all font-semibold"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/log"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-600 via-amber-600 to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-500/20 hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" /> New Incident Log
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 sm:p-5 rounded-3xl border border-slate-200/90 space-y-3.5 shadow-xs bg-white">
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by Employee, ID Card, Type, Category, Location, Equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full font-semibold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="text-slate-500 font-extrabold flex items-center gap-1.5 mr-1">
            <Filter className="w-4 h-4 text-sky-600" /> Filters:
          </span>

          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
          >
            <option value="">All Years</option>
            {yearsList.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={filterShift}
            onChange={(e) => setFilterShift(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
          >
            <option value="">All Shifts</option>
            <option>Day</option>
            <option>Night</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
          >
            <option value="">All Statuses</option>
            <option>Opened</option>
            <option>Under Review</option>
            <option>Completed</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
          >
            <option value="">All Types</option>
            <option>Accident</option>
            <option>Incident</option>
            <option>Injury</option>
            <option>Near Miss</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
          >
            <option value="">All Categories</option>
            <option>Ro Ro</option>
            <option>Container</option>
            <option>Fire</option>
            <option>Construction</option>
            <option>Others</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/90 text-slate-600 uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" /> Date & Time
                  </span>
                </th>
                <th className="py-3.5 px-4">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" /> Employee
                  </span>
                </th>
                <th className="py-3.5 px-4">
                  <span className="flex items-center gap-1">
                    <IdCard className="w-3 h-3 text-slate-500" /> ID Card No.
                  </span>
                </th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Shift</th>
                <th className="py-3.5 px-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" /> Location
                  </span>
                </th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Documents</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium bg-white">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-sky-600" />
                      Fetching records...
                    </div>
                  </td>
                </tr>
              ) : filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500 font-medium">
                    No safety records matched the specified filters.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => {
                  const emp = getEmp(inc.empId);
                  return (
                    <tr
                      key={inc.id}
                      className="hover:bg-sky-50/50 transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-black text-sky-600">
                        {inc.id}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-800 font-semibold">
                        {inc.date.slice(0, 10)}{' '}
                        <span className="text-[10px] text-slate-400 font-mono">{inc.date.slice(11, 16)}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-extrabold text-slate-900 group-hover:text-sky-700 transition-colors">{emp.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{emp.dept}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 font-mono">
                        {emp.idnum}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">{inc.type}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-semibold">{inc.category}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border flex items-center gap-1 w-max ${
                            inc.shift === 'Night'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {inc.shift}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-[130px] truncate text-slate-600 font-medium">
                        {inc.location}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold border flex items-center gap-1 w-max ${
                            inc.status === 'Opened'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : inc.status === 'Under Review'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <Activity className="w-3 h-3" />
                          {inc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {inc.docs && inc.docs.length > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] bg-sky-50 text-sky-700 border border-sky-200 font-extrabold">
                            <Paperclip className="w-3 h-3 text-sky-600" /> {inc.docs.length} file{inc.docs.length > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => setSelectedIncident(inc)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shadow-2xs"
                          title="View Case Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingIncident(inc)}
                          className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200/60 transition-colors shadow-2xs"
                          title="Edit Incident Record"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteIncident(inc.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 transition-colors shadow-2xs"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Details Modal */}
      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          employees={employees}
          onClose={() => setSelectedIncident(null)}
          onUpdateStatus={handleUpdateStatus}
          onAddDoc={handleAddDoc}
          onRemoveDoc={handleRemoveDoc}
          onEditRecord={(inc) => {
            setEditingIncident(inc);
          }}
        />
      )}

      {/* Incident Full Edit Modal */}
      {editingIncident && (
        <IncidentEditModal
          isOpen={!!editingIncident}
          incident={editingIncident}
          employees={employees}
          onClose={() => setEditingIncident(null)}
          onSave={handleSaveEditIncident}
        />
      )}
    </div>
  );
}
