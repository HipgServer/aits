'use client';

import React, { useState, useEffect } from 'react';
import { IncidentType, EmployeeType } from '@/types';
import {
  X,
  Save,
  Edit3,
  User,
  Calendar,
  AlertTriangle,
  Layers,
  Clock,
  MapPin,
  Wrench,
  Activity,
  FileText,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Shield,
  Eye,
} from 'lucide-react';

interface IncidentEditModalProps {
  isOpen: boolean;
  incident: IncidentType | null;
  employees: EmployeeType[];
  onClose: () => void;
  onSave: (updatedIncident: IncidentType) => void;
}

export default function IncidentEditModal({
  isOpen,
  incident,
  employees,
  onClose,
  onSave,
}: IncidentEditModalProps) {
  const [formData, setFormData] = useState<IncidentType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (incident) {
      setFormData({ ...incident });
    }
  }, [incident, isOpen]);

  if (!isOpen || !formData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.empId ||
      !formData.date ||
      !formData.type ||
      !formData.category ||
      !formData.shift ||
      !formData.location ||
      !formData.equipment ||
      !formData.desc
    ) {
      alert('Please fill out all required fields marked with an asterisk (*).');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to update incident:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden max-h-[90vh] my-auto">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-5 sm:px-6 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
              <Edit3 className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                Modify Incident Record
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
                  {formData.id}
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Update incident details in database</p>
            </div>
          </div>
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
            {/* Employee & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-600" /> Involved Employee <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.empId}
                  onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium transition-all"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.id}) — {e.employer}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Date & Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.date.slice(0, 16)}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium transition-all"
                />
              </div>
            </div>

            {/* Type, Category, Shift */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Incident Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium transition-all"
                >
                  <option>Accident</option>
                  <option>Incident</option>
                  <option>Injury</option>
                  <option>Near Miss</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" /> Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium transition-all"
                >
                  <option>Ro Ro</option>
                  <option>Container</option>
                  <option>Fire</option>
                  <option>Construction</option>
                  <option>Others</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-600" /> Shift <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium transition-all"
                >
                  <option>Day</option>
                  <option>Night</option>
                </select>
              </div>
            </div>

            {/* Location & Equipment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-600" /> Equipment <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium transition-all"
                />
              </div>
            </div>

            {/* Injury, Bodypart, Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-600" /> Injury Type
                </label>
                <select
                  value={formData.injury || 'None'}
                  onChange={(e) => setFormData({ ...formData, injury: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium transition-all"
                >
                  <option value="None">None</option>
                  <option>Cut / Laceration</option>
                  <option>Fracture</option>
                  <option>Burn</option>
                  <option>Sprain / Strain</option>
                  <option>Contusion</option>
                  <option>Crush Injury</option>
                  <option>Head Injury</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" /> Body Part Affected
                </label>
                <input
                  type="text"
                  value={formData.bodypart || ''}
                  onChange={(e) => setFormData({ ...formData, bodypart: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-bold transition-all"
                >
                  <option>Opened</option>
                  <option>Under Review</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-600" /> Detailed Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium transition-all"
              />
            </div>

            {/* Action & Witness */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Immediate Action Taken
                </label>
                <textarea
                  rows={2}
                  value={formData.action || ''}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-600" /> Witnesses & Reporter
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Witnesses"
                    value={formData.witness || ''}
                    onChange={(e) => setFormData({ ...formData, witness: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Reported By"
                    value={formData.reporter || ''}
                    onChange={(e) => setFormData({ ...formData, reporter: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer Buttons */}
          <div className="flex items-center justify-end gap-2 p-4 sm:px-6 bg-slate-50 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-sky-500/20 hover:opacity-95 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

