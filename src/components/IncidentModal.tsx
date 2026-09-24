'use client';

import React, { useState, useEffect } from 'react';
import { IncidentType, EmployeeType, DocumentItemType } from '@/types';
import {
  X,
  FileText,
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Wrench,
  User,
  Shield,
  Eye,
  Pencil,
  Activity,
  Calendar,
  Layers,
  FileSpreadsheet,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface IncidentModalProps {
  incident: IncidentType | null;
  employees: EmployeeType[];
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  onAddDoc: (incId: string, doc: DocumentItemType) => void;
  onRemoveDoc: (incId: string, docIndex: number) => void;
  onEditRecord?: (incident: IncidentType) => void;
}

export default function IncidentModal({
  incident,
  employees,
  onClose,
  onUpdateStatus,
  onAddDoc,
  onRemoveDoc,
  onEditRecord,
}: IncidentModalProps) {
  const [selectedDocType, setSelectedDocType] = useState<string>('Statement');
  const [currentStatus, setCurrentStatus] = useState<string>(incident?.status || 'Opened');

  // Prevent parent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!incident) return null;

  const emp = employees.find((e) => e.id === incident.empId) || {
    id: incident.empId,
    idnum: '—',
    name: 'Unknown Employee',
    employer: '—',
    role: '—',
    dept: '—',
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} exceeds 10 MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        const newDoc: DocumentItemType = {
          name: file.name,
          data: base64Data,
          docType: selectedDocType,
          uploadedAt: new Date().toISOString().slice(0, 10),
        };
        onAddDoc(incident.id, newDoc);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden max-h-[90vh] my-auto">
        {/* Fixed Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-sky-700 bg-sky-100/80 px-3 py-1 rounded-lg border border-sky-200/80 flex items-center gap-1 shadow-2xs">
                <Shield className="w-3.5 h-3.5 text-sky-600" />
                {incident.id}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold border flex items-center gap-1 ${
                  incident.shift === 'Night'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                <Clock className="w-3 h-3" />
                {incident.shift} Shift
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold border flex items-center gap-1 ${
                  incident.status === 'Opened'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : incident.status === 'Under Review'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                <Activity className="w-3 h-3" />
                {incident.status}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              {incident.type}{' '}
              <span className="text-slate-500 text-sm font-semibold">({incident.category})</span>
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mt-1.5">
              <span className="flex items-center gap-1 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> {incident.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-sky-600" /> {incident.date.replace('T', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onEditRecord && (
              <button
                onClick={() => onEditRecord(incident)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold border border-sky-200 transition-all shadow-2xs"
                title="Edit Full Incident Record"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar">
          {/* Employee Info Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/50 border border-slate-200/90 flex items-start gap-3.5 shadow-2xs">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white font-black text-base shrink-0 shadow-md shadow-sky-500/20">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-xs space-y-1.5">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  {emp.name}
                </h4>
                <span className="text-slate-500 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 font-medium">
                  Emp ID: <strong className="text-sky-700 font-mono">{emp.id}</strong>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-600 font-medium pt-0.5">
                <p className="flex items-center gap-1">
                  <span className="text-slate-400">ID Card:</span> <strong className="text-slate-900">{emp.idnum}</strong>
                </p>
                <p className="flex items-center gap-1">
                  <span className="text-slate-400">Employer:</span> <strong className="text-slate-900">{emp.employer}</strong>
                </p>
                <p className="flex items-center gap-1">
                  <span className="text-slate-400">Role:</span> <strong className="text-slate-900">{emp.role}</strong>
                </p>
                <p className="flex items-center gap-1">
                  <span className="text-slate-400">Dept:</span> <strong className="text-slate-900">{emp.dept}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="sm:col-span-2 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl">
              <span className="text-amber-800 font-bold block mb-1 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-amber-600" /> Equipment & Machinery Involved
              </span>
              <strong className="text-slate-900 font-semibold">{incident.equipment || 'None Specified'}</strong>
            </div>

            {incident.injury && incident.injury !== 'None' && (
              <div className="p-3.5 bg-rose-50/80 rounded-2xl border border-rose-200/80">
                <span className="text-rose-700 font-bold block mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" /> Injury Type
                </span>
                <strong className="text-rose-900 font-extrabold">{incident.injury}</strong>
              </div>
            )}

            {incident.bodypart && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-semibold block mb-1 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-sky-600" /> Body Part Affected
                </span>
                <strong className="text-slate-900 font-bold">{incident.bodypart}</strong>
              </div>
            )}

            {incident.reporter && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-semibold block mb-1 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-600" /> Logged By (Supervisor)
                </span>
                <strong className="text-slate-900 font-bold">{incident.reporter}</strong>
              </div>
            )}

            {incident.witness && (
              <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-semibold block mb-1 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-600" /> Witness Assertions
                </span>
                <strong className="text-slate-900 font-semibold">{incident.witness}</strong>
              </div>
            )}
          </div>

          {/* Description & Action */}
          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-800 font-extrabold block mb-1.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" /> Full Fact Description Statement
              </span>
              <p className="p-4 rounded-2xl bg-slate-50 text-slate-800 leading-relaxed border border-slate-200 font-medium whitespace-pre-wrap">
                {incident.desc}
              </p>
            </div>

            {incident.action && (
              <div>
                <span className="text-emerald-800 font-extrabold block mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Immediate Mitigation Response Action
                </span>
                <p className="p-4 rounded-2xl bg-emerald-50/80 text-emerald-900 leading-relaxed border border-emerald-200/90 font-medium whitespace-pre-wrap">
                  {incident.action}
                </p>
              </div>
            )}
          </div>

          {/* Attached Documents */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-rose-600" /> Attached PDF Documents ({incident.docs?.length || 0})
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  <option>Statement</option>
                  <option>Incident Report</option>
                  <option>Investigation Report</option>
                  <option>Other</option>
                </select>
                <label className="px-3.5 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all shadow-md shadow-sky-500/15">
                  <Upload className="w-3.5 h-3.5" /> Upload PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {!incident.docs || incident.docs.length === 0 ? (
                <div className="p-4 text-center border border-dashed border-slate-300 rounded-xl bg-white">
                  <p className="text-xs text-slate-400 italic">No PDF documents attached yet.</p>
                </div>
              ) : (
                incident.docs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs shadow-2xs hover:border-sky-300 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-slate-900 truncate">{doc.name}</p>
                        <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-bold">{doc.docType}</span>
                          • {doc.uploadedAt}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={doc.data}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="View PDF"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={doc.data}
                        download={doc.name}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => onRemoveDoc(incident.id, idx)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Fixed Footer Status Bar */}
        <div className="flex items-center justify-between p-4 sm:px-6 bg-slate-50 border-t border-slate-200 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-800 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Update Workflow:
            </span>
            <select
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option>Opened</option>
              <option>Under Review</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onUpdateStatus(incident.id, currentStatus);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/20 hover:opacity-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

