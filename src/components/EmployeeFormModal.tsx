'use client';

import React, { useState, useEffect } from 'react';
import { EmployeeType } from '@/types';
import { X, Save, UserPlus, UserCheck } from 'lucide-react';

interface EmployeeFormModalProps {
  isOpen: boolean;
  editingEmployee: EmployeeType | null;
  onClose: () => void;
  onSave: (employeeData: EmployeeType) => void;
}

export default function EmployeeFormModal({
  isOpen,
  editingEmployee,
  onClose,
  onSave,
}: EmployeeFormModalProps) {
  const [formData, setFormData] = useState<EmployeeType>({
    id: '',
    idnum: '',
    name: '',
    employer: '',
    role: '',
    dept: '',
  });

  useEffect(() => {
    if (editingEmployee) {
      setFormData(editingEmployee);
    } else {
      setFormData({ id: '', idnum: '', name: '', employer: '', role: '', dept: '' });
    }
  }, [editingEmployee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.idnum || !formData.name || !formData.employer || !formData.role || !formData.dept) {
      alert('Please fill out all required fields (*).');
      return;
    }
    onSave(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            {editingEmployee ? <UserCheck className="w-5 h-5 text-sky-600" /> : <UserPlus className="w-5 h-5 text-emerald-600" />}
            {editingEmployee ? 'Modify Employee Profile' : 'Register New Employee'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-800 font-bold mb-1">
                Employee No. <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. EMP-009"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                disabled={!!editingEmployee}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1">
                ID / Passport Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="National ID / Passport"
                value={formData.idnum}
                onChange={(e) => setFormData({ ...formData, idnum: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Kasun Jayawardena"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1">
              Employer / Contractor Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Port Logistics Ltd / Subcontractor"
              value={formData.employer}
              onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-800 font-bold mb-1">
                Role / Designation <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Forklift Operator"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Warehouse"
                value={formData.dept}
                onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold shadow-md shadow-sky-500/20 hover:opacity-95 transition-all"
            >
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
