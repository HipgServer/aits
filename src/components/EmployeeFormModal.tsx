'use client';

import React, { useState, useEffect } from 'react';
import { EmployeeType } from '@/types';
import { X, Save, UserPlus, UserCheck, IdCard, User, Building, Briefcase, Network } from 'lucide-react';

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

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full flex flex-col shadow-2xl overflow-hidden max-h-[90vh] my-auto">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            {editingEmployee ? <UserCheck className="w-5 h-5 text-sky-600" /> : <UserPlus className="w-5 h-5 text-emerald-600" />}
            {editingEmployee ? 'Modify Employee Profile' : 'Register New Employee'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs custom-scrollbar">
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <IdCard className="w-3.5 h-3.5 text-sky-600" /> Employee No. <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. EMP-009"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  disabled={!!editingEmployee}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <IdCard className="w-3.5 h-3.5 text-indigo-600" /> ID / Passport No. <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="National ID / Passport"
                  value={formData.idnum}
                  onChange={(e) => setFormData({ ...formData, idnum: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sky-600" /> Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Kasun Jayawardena"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-600" /> Employer / Contractor Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Port Logistics Ltd / Subcontractor"
                value={formData.employer}
                onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" /> Role / Designation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Forklift Operator"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-sky-600" /> Department <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Warehouse"
                  value={formData.dept}
                  onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Fixed Footer Buttons */}
          <div className="flex items-center justify-end gap-2 p-4 sm:px-6 bg-slate-50 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 hover:opacity-95 transition-all"
            >
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

