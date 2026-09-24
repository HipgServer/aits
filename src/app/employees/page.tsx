'use client';

import React, { useEffect, useState } from 'react';
import { EmployeeType, IncidentType } from '@/types';
import EmployeeFormModal from '@/components/EmployeeFormModal';
import {
  UserPlus,
  Search,
  Pencil,
  Trash2,
  X,
  History,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [incidents, setIncidents] = useState<IncidentType[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmpDetail, setSelectedEmpDetail] = useState<EmployeeType | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<EmployeeType | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resEmp, resInc] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/incidents'),
      ]);
      const dataEmp = await resEmp.json();
      const dataInc = await resInc.json();

      if (dataEmp.success) setEmployees(dataEmp.data);
      if (dataInc.success) setIncidents(dataInc.data);
    } catch (err) {
      console.error('Error fetching employee data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getEmpIncidents = (empId: string) => {
    return incidents.filter((i) => i.empId === empId).sort((a, b) => b.date.localeCompare(a.date));
  };

  const getRiskLevel = (count: number) => {
    if (count >= 3) return { label: 'High Risk', cls: 'bg-rose-50 text-rose-700 border-rose-200 font-bold' };
    if (count >= 2) return { label: 'Medium Risk', cls: 'bg-amber-50 text-amber-700 border-amber-200 font-bold' };
    if (count >= 1) return { label: 'Low Risk', cls: 'bg-sky-50 text-sky-700 border-sky-200 font-semibold' };
    return { label: 'None', cls: 'bg-slate-100 text-slate-600 border-slate-200 font-medium' };
  };

  const getLastIncidentDate = (empId: string) => {
    const list = getEmpIncidents(empId);
    return list.length ? list[0].date.slice(0, 10) : '—';
  };

  const filteredEmployees = employees.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return [e.name, e.id, e.idnum, e.employer, e.dept, e.role].join(' ').toLowerCase().includes(q);
  });

  const handleSaveEmployee = async (empData: EmployeeType) => {
    try {
      if (editingEmp) {
        // Edit existing
        const res = await fetch(`/api/employees/${empData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(empData),
        });
        const data = await res.json();
        if (data.success) {
          setEmployees((prev) => prev.map((e) => (e.id === empData.id ? empData : e)));
          if (selectedEmpDetail?.id === empData.id) {
            setSelectedEmpDetail(empData);
          }
        }
      } else {
        // Create new
        const res = await fetch('/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(empData),
        });
        const data = await res.json();
        if (data.success) {
          setEmployees((prev) => [data.data, ...prev]);
        } else {
          alert(data.error || 'Failed to save employee.');
          return;
        }
      }
      setIsModalOpen(false);
      setEditingEmp(null);
    } catch (err) {
      console.error('Error saving employee:', err);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    const empIncs = getEmpIncidents(id);
    if (empIncs.length > 0) {
      if (!confirm(`This employee has ${empIncs.length} historic incident records. Remove profile?`)) {
        return;
      }
    } else {
      if (!confirm(`Delete profile for ${id}?`)) return;
    }

    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setEmployees((prev) => prev.filter((e) => e.id !== id));
        if (selectedEmpDetail?.id === id) setSelectedEmpDetail(null);
      }
    } catch (err) {
      console.error('Failed to delete employee:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Employee Master Register
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational personnel registry, contractor details, risk profiles, and safety logs history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditingEmp(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Add New Employee
          </button>
        </div>
      </div>

      {/* Selected Employee History Overview Drawer */}
      {selectedEmpDetail && (
        <div className="glass-card p-6 rounded-3xl border-2 border-sky-400 bg-sky-50/30 space-y-4 relative animate-in fade-in duration-200 shadow-sm">
          <div className="flex items-start justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-md">
                {selectedEmpDetail.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedEmpDetail.name}
                  </h3>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    ({selectedEmpDetail.id})
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      getRiskLevel(getEmpIncidents(selectedEmpDetail.id).length).cls
                    }`}
                  >
                    {getRiskLevel(getEmpIncidents(selectedEmpDetail.id).length).label}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  ID Card: <strong className="text-slate-900">{selectedEmpDetail.idnum}</strong> • Employer: <strong className="text-slate-900">{selectedEmpDetail.employer}</strong> • {selectedEmpDetail.role} ({selectedEmpDetail.dept})
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedEmpDetail(null)}
              className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 transition-colors shadow-2xs"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <History className="w-4 h-4 text-sky-600" /> Historical Safety Incident Log Index ({getEmpIncidents(selectedEmpDetail.id).length})
            </h4>

            {getEmpIncidents(selectedEmpDetail.id).length === 0 ? (
              <p className="text-xs text-slate-500 italic">Clear record sheet. No documented history found for this employee.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Shift</th>
                      <th className="p-2.5">Location</th>
                      <th className="p-2.5">Equipment</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {getEmpIncidents(selectedEmpDetail.id).map((inc) => (
                      <tr key={inc.id} className="hover:bg-slate-50">
                        <td className="p-2.5 text-slate-700">{inc.date.slice(0, 10)}</td>
                        <td className="p-2.5 font-bold text-slate-900">{inc.type}</td>
                        <td className="p-2.5 text-slate-600">{inc.category}</td>
                        <td className="p-2.5">{inc.shift}</td>
                        <td className="p-2.5 text-slate-700">{inc.location}</td>
                        <td className="p-2.5 font-mono text-slate-600">{inc.equipment || '—'}</td>
                        <td className="p-2.5 font-semibold text-slate-700">{inc.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search employees by Name, Emp No, ID Card, Employer, Department, Role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full font-medium"
          />
        </div>
      </div>

      {/* Roster Table */}
      <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee Name</th>
                <th className="py-3 px-4">Emp No</th>
                <th className="py-3 px-4">ID Card Number</th>
                <th className="py-3 px-4">Employer</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-center">Total Logs</th>
                <th className="py-3 px-4">Last Event</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium bg-white">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 font-medium">
                    Loading personnel roster...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500 font-medium">
                    No employees matched the query.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((e) => {
                  const empIncCount = getEmpIncidents(e.id).length;
                  const risk = getRiskLevel(empIncCount);
                  return (
                    <tr
                      key={e.id}
                      onClick={() => setSelectedEmpDetail(e)}
                      className="hover:bg-sky-50/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {e.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-900">{e.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-500">
                        {e.id}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {e.idnum}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{e.employer}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{e.dept}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{e.role}</td>
                      <td className="py-3 px-4 text-center font-extrabold text-sm">
                        <span className={empIncCount >= 2 ? 'text-rose-600' : 'text-slate-400'}>
                          {empIncCount}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-medium">
                        {getLastIncidentDate(e.id)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] border ${risk.cls}`}>
                          {risk.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-1" onClick={(ev) => ev.stopPropagation()}>
                        <button
                          onClick={() => {
                            setEditingEmp(e);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Edit Profile"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(e.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Delete Employee"
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

      {/* Employee Form Modal */}
      <EmployeeFormModal
        isOpen={isModalOpen}
        editingEmployee={editingEmp}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmp(null);
        }}
        onSave={handleSaveEmployee}
      />
    </div>
  );
}
