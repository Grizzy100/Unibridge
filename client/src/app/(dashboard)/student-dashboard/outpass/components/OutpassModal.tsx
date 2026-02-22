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
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

    <div
      className="
      bg-white
      rounded-2xl
      w-full max-w-md
      border border-gray-200/80
      shadow-[0_20px_60px_rgba(0,0,0,0.12)]
      "
    >

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">

        <div>
          <h2 className="text-[16px] font-semibold text-slate-900">
            Create Outpass
          </h2>

          <p className="text-[12px] text-slate-500 mt-0.5">
            Fill in the details
          </p>
        </div>

        <button
          onClick={onClose}
          className="
          text-slate-400
          hover:text-slate-600
          hover:bg-slate-100
          rounded-lg
          p-1.5
          transition
          "
        >
          <FiX size={16} />
        </button>

      </div>


      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="
        px-5 pb-5
        space-y-3
        max-h-[80vh]
        overflow-y-auto
        "
      >

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-[12px] flex gap-2">
            <FiAlertCircle size={14} />
            {error}
          </div>
        )}


        {/* Type */}
        <div className="space-y-1">

          <label className="text-[12px] font-medium text-slate-700">
            Outpass Type
          </label>

          <Select
            value={formData.type}
            onValueChange={(v) => setFormData({ ...formData, type: v })}
          >

            <SelectTrigger
              className="
              h-9
              rounded-xl
              border border-gray-200
              text-[13px]
              shadow-sm
              focus:ring-4 focus:ring-slate-200
              "
            >
              <div className="flex items-center gap-2">

                <div className="h-6 w-6 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-semibold">
                  {formData.type === "DAY_PASS" ? "D" : "L"}
                </div>

                <SelectValue />

              </div>

            </SelectTrigger>

            <SelectContent className="rounded-xl border border-gray-200 shadow-lg">

              <SelectItem value="DAY_PASS" className="text-[13px]">
                Day Pass
              </SelectItem>

              <SelectItem value="LEAVE_PASS" className="text-[13px]">
                Leave Pass
              </SelectItem>

            </SelectContent>

          </Select>

        </div>


        {/* Reason */}
        <div className="space-y-1">

          <label className="text-[12px] font-medium text-slate-700">
            Reason
          </label>

          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            rows={2}
            className="
            w-full
            border border-gray-200
            rounded-xl
            px-3 py-2
            text-[13px]
            focus:ring-4 focus:ring-slate-200
            resize-none
            "
          />

          <p className="text-[11px] text-slate-500">
            {formData.reason.length}/500
          </p>

        </div>


        {/* Dates */}
        <div className="grid gap-3">

          <div className="space-y-1">

            <label className="text-[12px] font-medium text-slate-700">
              Outgoing
            </label>

            <input
              type="datetime-local"
              value={formData.outgoingDateTime}
              onChange={(e) =>
                setFormData({ ...formData, outgoingDateTime: e.target.value })
              }
              className="
              w-full
              border border-gray-200
              rounded-xl
              px-3 py-2
              text-[13px]
              focus:ring-4 focus:ring-slate-200
              "
            />

          </div>


          <div className="space-y-1">

            <label className="text-[12px] font-medium text-slate-700">
              Returning
            </label>

            <input
              type="datetime-local"
              value={formData.returningDateTime}
              onChange={(e) =>
                setFormData({ ...formData, returningDateTime: e.target.value })
              }
              className="
              w-full
              border border-gray-200
              rounded-xl
              px-3 py-2
              text-[13px]
              focus:ring-4 focus:ring-slate-200
              "
            />

          </div>

        </div>


        {/* Upload */}
        <div className="space-y-1">

          <label className="text-[12px] font-medium text-slate-700">
            Proof Document
          </label>

          {!file ? (

            <label
              htmlFor="proof-upload"
              className="
              h-20
              flex flex-col items-center justify-center
              border border-dashed border-gray-300
              rounded-xl
              cursor-pointer
              hover:border-gray-400
              transition
              "
            >

              <FiUpload size={18} className="text-slate-400 mb-1" />

              <p className="text-[12px] text-slate-500">
                Upload file
              </p>

              <input
                id="proof-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />

            </label>

          ) : (

            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2">

              <FiFile size={16} />

              <span className="text-[12px] truncate">
                {file.name}
              </span>

              <button
                type="button"
                onClick={() => setFile(null)}
                className="ml-auto text-slate-400 hover:text-slate-600"
              >
                <FiX size={14} />
              </button>

            </div>

          )}

        </div>


        {/* Actions */}
        <div className="flex gap-2 pt-2">

          <button
            type="button"
            onClick={onClose}
            className="
            flex-1
            border border-gray-200
            rounded-xl
            py-2
            text-[13px]
            font-medium
            hover:bg-slate-50
            transition
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="
            flex-1
            bg-slate-900
            text-white
            rounded-xl
            py-2
            text-[13px]
            font-medium
            hover:bg-slate-800
            transition
            "
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

        </div>

      </form>

    </div>

  </div>
);
}
