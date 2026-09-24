'use client';

import React, { useState } from 'react';
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

  if (!incident) return null;

  const emp = employees.find((e) => e.id === incident.empId) || {
    id: incident.empId,
    idnum: '—',
    name: 'Unknown Employee',
    employer: '—',
    role: '—',
    dept: '—',
  };

  const empIncidentsCount = employees.filter(() => true).length; // Updated via API
  const getRiskBadge = (count: number) => {
    if (count >= 3) return { label: 'High Risk', cls: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
    if (count >= 2) return { label: 'Medium Risk', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    if (count >= 1) return { label: 'Low Risk', cls: 'bg-sky-500/20 text-sky-400 border-sky-500/30' };
    return { label: 'None', cls: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
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
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                {incident.id}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  incident.shift === 'Night'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {incident.shift} Shift
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  incident.status === 'Opened'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : incident.status === 'Under Review'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {incident.status}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {incident.type} <span className="text-slate-500 text-sm font-normal">({incident.category})</span>
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> {incident.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> {incident.date.replace('T', ' ')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onEditRecord && (
              <button
                onClick={() => onEditRecord(incident)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold border border-sky-200 transition-colors shadow-2xs"
                title="Edit Full Incident Record"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit Record
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Employee Info Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-2xs">
            {emp.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900">{emp.name}</h4>
              <span className="text-slate-500">Emp No: <strong className="text-slate-900 font-mono">{emp.id}</strong></span>
            </div>
            <p className="text-slate-600 font-medium">
              ID Card: <strong className="text-slate-900">{emp.idnum}</strong> • Employer: <strong className="text-slate-900">{emp.employer}</strong>
            </p>
            <p className="text-slate-600 font-medium">
              Role: {emp.role} • Dept: {emp.dept}
            </p>
          </div>
        </div>

        {/* Detailed Fields */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="col-span-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-amber-800 font-bold block mb-0.5 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-amber-600" /> Equipment & Machinery Involved
            </span>
            <strong className="text-slate-900">{incident.equipment || 'None Specified'}</strong>
          </div>

          {incident.injury && incident.injury !== 'None' && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block mb-0.5">Injury Type</span>
              <strong className="text-rose-700 font-bold">{incident.injury}</strong>
            </div>
          )}

          {incident.bodypart && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block mb-0.5">Body Part Affected</span>
              <strong className="text-slate-900 font-bold">{incident.bodypart}</strong>
            </div>
          )}

          {incident.reporter && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block mb-0.5">Logged By</span>
              <strong className="text-slate-900 font-bold">{incident.reporter}</strong>
            </div>
          )}

          {incident.witness && (
            <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block mb-0.5">Witness Assertions</span>
              <strong className="text-slate-900 font-bold">{incident.witness}</strong>
            </div>
          )}
        </div>

        {/* Description & Action */}
        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-600 font-bold block mb-1">
              Full Fact Description Statement
            </span>
            <p className="p-3.5 rounded-xl bg-slate-50 text-slate-800 leading-relaxed border border-slate-200 font-medium">
              {incident.desc}
            </p>
          </div>

          {incident.action && (
            <div>
              <span className="text-emerald-700 font-bold block mb-1">
                Immediate Mitigation Response Action
              </span>
              <p className="p-3.5 rounded-xl bg-emerald-50 text-emerald-900 leading-relaxed border border-emerald-200 font-medium">
                {incident.action}
              </p>
            </div>
          )}
        </div>

        {/* Attached Documents */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-sky-600" /> Attached Documents ({incident.docs?.length || 0})
            </span>
            <div className="flex items-center gap-2">
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
                className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 font-medium"
              >
                <option>Statement</option>
                <option>Incident Report</option>
                <option>Investigation Report</option>
                <option>Other</option>
              </select>
              <label className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 transition-colors shadow-2xs">
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

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {!incident.docs || incident.docs.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No PDF documents attached yet.</p>
            ) : (
              incident.docs.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate">{doc.name}</p>
                      <span className="text-[10px] text-slate-500 font-medium">{doc.docType} • {doc.uploadedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <a
                      href={doc.data}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                      title="View PDF"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={doc.data}
                      download={doc.name}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => onRemoveDoc(incident.id, idx)}
                      className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100"
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

        {/* Update Status Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-700 font-bold">Update Status:</span>
            <select
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold"
            >
              <option>Opened</option>
              <option>Under Review</option>
              <option>Completed</option>
            </select>
          </div>
          <button
            onClick={() => {
              onUpdateStatus(incident.id, currentStatus);
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/20 hover:opacity-90 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" /> Commit Status
          </button>
        </div>
      </div>
    </div>
  );
}
