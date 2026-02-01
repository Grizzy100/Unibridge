// client/src/app/(dashboard)/student-dashboard/outpass/components/OutpassModal.tsx
'use client';

import { useState } from 'react';
import { FiX, FiUpload, FiAlertCircle, FiFile } from 'react-icons/fi';
import { outpassAPI } from '../../../../../../lib/outpass';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../components/ui/select";


interface OutpassModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function OutpassModal({ onClose, onSuccess }: OutpassModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    type: 'DAY_PASS',
    reason: '',
    outgoingDateTime: '',
    returningDateTime: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.reason.trim()) {
      errors.reason = 'Reason is required';
    } else if (formData.reason.trim().length < 10) {
      errors.reason = 'Reason must be at least 10 characters';
    } else if (formData.reason.trim().length > 500) {
      errors.reason = 'Reason must not exceed 500 characters';
    }

    if (!formData.outgoingDateTime) {
      errors.outgoingDateTime = 'Outgoing date and time is required';
    }

    if (!formData.returningDateTime) {
      errors.returningDateTime = 'Returning date and time is required';
    }

    if (formData.outgoingDateTime && formData.returningDateTime) {
      const outgoing = new Date(formData.outgoingDateTime);
      const returning = new Date(formData.returningDateTime);
      
      if (returning <= outgoing) {
        errors.returningDateTime = 'Returning datetime must be after outgoing datetime';
      }
    }

    if (formData.type === 'LEAVE_PASS' && !file) {
      errors.file = 'Proof document is required for leave pass';
    }

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        errors.file = 'Only JPG, PNG, and PDF files are allowed';
      } else if (file.size > maxSize) {
        errors.file = 'File size must be less than 5MB';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append('type', formData.type);
    data.append('reason', formData.reason);
    data.append('outgoingDateTime', formData.outgoingDateTime);
    data.append('returningDateTime', formData.returningDateTime);
    if (file) data.append('proof', file);

    try {
      await outpassAPI.create(data);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create outpass request');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFieldErrors(prev => ({ ...prev, file: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Create Outpass</h2>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the details below</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1.5 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4 max-h-[calc(90vh-80px)] overflow-y-auto">
          {/* Global Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 px-3 py-2.5 rounded-lg text-xs flex items-start gap-2">
              <FiAlertCircle className="flex-shrink-0 w-4 h-4 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Outpass Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Outpass Type <span className="text-red-500">*</span>
            </label>

            <Select
              value={formData.type}
              onValueChange={(v) => setFormData({ ...formData, type: v })}
            >
              <SelectTrigger
  className="
    h-11 w-full rounded-xl bg-white
    border border-slate-200
    px-3 text-sm text-slate-900
    shadow-sm
    transition-all duration-300 ease-out
    hover:bg-slate-50
    focus:outline-none focus:ring-4 focus:ring-slate-200
    data-[state=open]:ring-4 data-[state=open]:ring-slate-200
  "
>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-[11px] font-semibold text-slate-700">
                    {formData.type === "DAY_PASS" ? "D" : "L"}
                  </div>
                  <SelectValue placeholder="Select outpass type" />
                </div>
              </SelectTrigger>

              <SelectContent
                className="
                  rounded-xl border border-slate-200 shadow-xl
                  overflow-hidden
                  data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95
                  data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95
                  data-[state=open]:duration-300 data-[state=closed]:duration-200
                "
                position="popper"
              >
                <SelectItem value="DAY_PASS" className="py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">Day Pass</span>
                  </div>
                </SelectItem>

                <SelectItem value="LEAVE_PASS" className="py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">Leave Pass</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <p className="text-[11px] text-slate-500">
              {formData.type === "DAY_PASS" ? "For single day outings" : "For multiple days leave"}
            </p>
          </div>


          {/* Reason */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => {
                setFormData({ ...formData, reason: e.target.value });
                setFieldErrors(prev => ({ ...prev, reason: '' }));
              }}
              placeholder="Enter detailed reason..."
              className={`w-full bg-white border ${fieldErrors.reason ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-slate-900'} rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow resize-none`}
              rows={3}
              required
            />
            <div className="flex items-center justify-between">
              {fieldErrors.reason ? (
                <p className="text-[11px] text-red-600">{fieldErrors.reason}</p>
              ) : (
                <p className="text-[11px] text-slate-500">
                  {formData.reason.length}/500
                </p>
              )}
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 gap-4">
            {/* Outgoing */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Outgoing <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.outgoingDateTime}
                onChange={(e) => {
                  setFormData({ ...formData, outgoingDateTime: e.target.value });
                  setFieldErrors(prev => ({ ...prev, outgoingDateTime: '' }));
                }}
                className={`w-full bg-white border ${fieldErrors.outgoingDateTime ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-slate-900'} rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
                required
              />
              {fieldErrors.outgoingDateTime && (
                <p className="text-[11px] text-red-600">{fieldErrors.outgoingDateTime}</p>
              )}
            </div>

            {/* Returning */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Returning <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.returningDateTime}
                onChange={(e) => {
                  setFormData({ ...formData, returningDateTime: e.target.value });
                  setFieldErrors(prev => ({ ...prev, returningDateTime: '' }));
                }}
                className={`w-full bg-white border ${fieldErrors.returningDateTime ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-slate-900'} rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
                required
              />
              {fieldErrors.returningDateTime && (
                <p className="text-[11px] text-red-600">{fieldErrors.returningDateTime}</p>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Proof Document
              {formData.type === 'LEAVE_PASS' && <span className="text-red-500 ml-0.5">*</span>}
              <span className="ml-1 text-[11px] font-normal text-slate-500">
                {formData.type === 'LEAVE_PASS' ? '(Required)' : '(Optional)'}
              </span>
            </label>
            
            {!file ? (
              <label 
                htmlFor="proof-upload" 
                className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed ${fieldErrors.file ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'} rounded-lg cursor-pointer transition-colors`}
              >
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <FiUpload className="w-7 h-7 text-slate-400" />
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-700">Click to upload</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">JPG, PNG or PDF (Max 5MB)</p>
                  </div>
                </div>
                <input
                  type="file"
                  id="proof-upload"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                />
              </label>
            ) : (
              <div className="relative">
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <FiFile className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">{file.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="flex-shrink-0 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded p-1 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            
            {fieldErrors.file && (
              <p className="text-[11px] text-red-600">{fieldErrors.file}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
