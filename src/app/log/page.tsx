'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmployeeType, DocumentItemType } from '@/types';
import {
  ShieldAlert,
  Save,
  RotateCcw,
  FileText,
  Upload,
  X,
  UserCheck,
  AlertTriangle,
  Calendar,
  MapPin,
  Wrench,
  User,
  Layers,
  Clock,
  Activity,
  CheckCircle2,
  Eye,
  Sparkles,
} from 'lucide-react';

export default function LogIncidentPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [shift, setShift] = useState('');
  const [location, setLocation] = useState('');
  const [equipment, setEquipment] = useState('');
  const [injury, setInjury] = useState('None');
  const [bodypart, setBodypart] = useState('');
  const [status, setStatus] = useState('Opened');
  const [desc, setDesc] = useState('');
  const [action, setAction] = useState('');
  const [witness, setWitness] = useState('');
  const [reporter, setReporter] = useState('');

  // Pending PDF documents
  const [pendingDocs, setPendingDocs] = useState<DocumentItemType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Set default datetime to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setDateTime(now.toISOString().slice(0, 16));

    // Fetch employees for dropdown
    fetch('/api/employees')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEmployees(data.data);
      });
  }, []);

  const selectedEmp = employees.find((e) => e.id === selectedEmpId);

  const handlePdfUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.type !== 'application/pdf') {
        alert('Please upload PDF files only.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} exceeds 10 MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        setPendingDocs((prev) => [
          ...prev,
          {
            name: file.name,
            data: base64Data,
            docType: 'Statement',
            uploadedAt: new Date().toISOString().slice(0, 10),
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePendingDoc = (idx: number) => {
    setPendingDocs((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDocTypeChange = (idx: number, newType: string) => {
    setPendingDocs((prev) =>
      prev.map((doc, i) => (i === idx ? { ...doc, docType: newType } : doc))
    );
  };

  const handleClear = () => {
    setSelectedEmpId('');
    setType('');
    setCategory('');
    setShift('');
    setLocation('');
    setEquipment('');
    setInjury('None');
    setBodypart('');
    setStatus('Opened');
    setDesc('');
    setAction('');
    setWitness('');
    setReporter('');
    setPendingDocs([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmpId || !dateTime || !type || !category || !shift || !location || !equipment || !desc) {
      alert('Please fill out all mandatory fields marked with an asterisk (*).');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        empId: selectedEmpId,
        date: dateTime,
        type,
        category,
        shift,
        location,
        equipment,
        injury,
        bodypart,
        status,
        desc,
        action,
        witness,
        reporter,
        docs: pendingDocs,
      };

      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Incident Report Filed Successfully: ${data.data.id}`);
        router.push('/incidents');
      } else {
        alert(data.error || 'Failed to submit incident report.');
      }
    } catch (err) {
      console.error('Error submitting report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 text-white shadow-xl shadow-sky-500/10">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl text-white shadow-md">
            <ShieldAlert className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              File New Operational Safety Report
            </h2>
            <p className="text-xs text-sky-100 mt-1 font-medium">
              Submit workplace accident, incident, injury or near-miss event logs directly into database.
            </p>
          </div>
        </div>
      </div>

      {/* Form Container with Internal Scroll */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Scrollable Form Body */}
          <div className="p-6 md:p-8 space-y-5 max-h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar">
            {/* Employee & Date Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-600" /> Involved Employee <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                >
                  <option value="">Select operational employee profile link...</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.id} / ID: {e.idnum}) — {e.employer}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Date & Time of Event <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Employee Preview Box */}
            {selectedEmp && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/50 border border-sky-200/90 flex items-center gap-3.5 text-xs shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="text-slate-800 space-y-0.5">
                  <div className="font-extrabold text-sm text-slate-900">{selectedEmp.name}</div>
                  <div className="text-slate-600 font-medium">
                    ID Card: <strong className="text-slate-900">{selectedEmp.idnum}</strong> • Employer: <strong className="text-slate-900">{selectedEmp.employer}</strong> • Role: {selectedEmp.role} ({selectedEmp.dept})
                  </div>
                </div>
              </div>
            )}

            {/* Type, Category, Shift */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Incident Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                >
                  <option value="">Select type...</option>
                  <option>Accident</option>
                  <option>Incident</option>
                  <option>Injury</option>
                  <option>Near Miss</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" /> Incident Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                >
                  <option value="">Select category...</option>
                  <option>Ro Ro</option>
                  <option>Container</option>
                  <option>Fire</option>
                  <option>Construction</option>
                  <option>Others</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-600" /> Shift Pattern <span className="text-rose-500">*</span>
                </label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                >
                  <option value="">Select shift...</option>
                  <option>Day</option>
                  <option>Night</option>
                </select>
              </div>
            </div>

            {/* Location & Equipment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> Location / Venue <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gate 3, Berth B"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-600" /> Equipment Details <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Forklift Model X200, Gantry Crane #2"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Injury, Bodypart, Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-600" /> Injury Type
                </label>
                <select
                  value={injury}
                  onChange={(e) => setInjury(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
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
                  placeholder="e.g. Right hand, N/A"
                  value={bodypart}
                  onChange={(e) => setBodypart(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Workflow Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                >
                  <option>Opened</option>
                  <option>Under Review</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="text-xs">
              <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-600" /> Detailed Incident Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Describe the sequence of events clearly..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
              />
            </div>

            {/* Immediate Action & Witnesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Immediate Action Taken
                </label>
                <textarea
                  rows={2}
                  placeholder="First aid response, cleanup operations, machinery isolation..."
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-600" /> Witnesses
                </label>
                <input
                  type="text"
                  placeholder="Witness statements / Names"
                  value={witness}
                  onChange={(e) => setWitness(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Reporter Name */}
            <div className="text-xs">
              <label className="block text-slate-800 font-bold mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-600" /> Reported By (Supervisor / Inspector Name)
              </label>
              <input
                type="text"
                placeholder="Your name / designation"
                value={reporter}
                onChange={(e) => setReporter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
              />
            </div>

            {/* PDF Documents Upload Section */}
            <div className="space-y-3 text-xs pt-2">
              <label className="block text-slate-800 font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-rose-600" /> Attach Supporting PDF Documents <span className="text-slate-400 font-normal">(optional, max 10 MB each)</span>
              </label>

              {/* Upload Area */}
              <div
                onClick={() => document.getElementById('pdf-file-input')?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handlePdfUpload(e.dataTransfer.files);
                }}
                className="p-6 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/40 text-center cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-all"
              >
                <Upload className="w-8 h-8 text-sky-600 mx-auto mb-2" />
                <p className="font-bold text-slate-800">
                  Click to upload or drag & drop PDFs
                </p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">
                  Statement • Incident Report • Investigation Report
                </p>
                <input
                  id="pdf-file-input"
                  type="file"
                  accept="application/pdf"
                  multiple
                  className="hidden"
                  onChange={(e) => handlePdfUpload(e.target.files)}
                />
              </div>

              {/* Pending List */}
              {pendingDocs.length > 0 && (
                <div className="space-y-2">
                  {pendingDocs.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="font-semibold text-slate-900 truncate">
                          {doc.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={doc.docType}
                          onChange={(e) => handleDocTypeChange(idx, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-medium"
                        >
                          <option>Statement</option>
                          <option>Incident Report</option>
                          <option>Investigation Report</option>
                          <option>Other</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemovePendingDoc(idx)}
                          className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Form Action Footer */}
          <div className="flex items-center justify-end gap-3 p-4 md:px-8 bg-slate-50 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors text-xs"
            >
              <RotateCcw className="w-4 h-4" /> Clear Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 hover:opacity-95 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {isSubmitting ? 'Saving...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
