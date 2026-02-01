// // client/src/app/(dashboard)/student-dashboard/task/components/SubmitTaskModal.tsx
// 'use client';

// import { useState } from 'react';
// import { submitTask, validateTaskFile } from '../../../../../../lib/task';
// import { FiX, FiUpload, FiFile, FiCheck } from 'react-icons/fi';

// interface SubmitTaskModalProps {
//   taskId: string;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function SubmitTaskModal({ taskId, onClose, onSuccess }: SubmitTaskModalProps) {
//   const [file, setFile] = useState<File | null>(null);
//   const [comment, setComment] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState('');
//   const [isDragging, setIsDragging] = useState(false);

//   const handleFileChange = (selectedFile: File) => {
//     const validation = validateTaskFile(selectedFile);
//     if (!validation.valid) {
//       setError(validation.error || 'Invalid file');
//       setFile(null);
//       return;
//     }

//     setFile(selectedFile);
//     setError('');
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
    
//     const droppedFile = e.dataTransfer.files[0];
//     if (droppedFile) {
//       handleFileChange(droppedFile);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!file) {
//       setError('Please select a file to upload');
//       return;
//     }

//     try {
//       setUploading(true);
//       setError('');

//       await submitTask(taskId, file, comment, (prog) => setProgress(prog));
      
//       onSuccess();
//     } catch (err: any) {
//       setError(err.message || 'Failed to submit task');
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
//       <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl animate-slideUp" onClick={(e) => e.stopPropagation()}>
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200">
//           <div>
//             <h2 className="text-lg font-bold text-gray-900">Submit Your Task</h2>
//             <p className="text-xs text-gray-500 mt-0.5">Upload your assignment file</p>
//           </div>
//           <button
//             onClick={onClose}
//             disabled={uploading}
//             className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
//           >
//             <FiX className="text-xl" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {/* File Upload Area */}
//           <div>
//             <label className="block text-xs font-semibold text-gray-700 mb-2">
//               Upload File *
//             </label>

//             {!file ? (
//               <div
//                 onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
//                 onDragLeave={() => setIsDragging(false)}
//                 onDrop={handleDrop}
//                 className={`
//                   relative border-2 border-dashed rounded-lg py-6  text-center transition-all duration-300
//                   ${isDragging 
//                     ? 'border-slate-900 bg-slate-50' 
//                     : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
//                   }
//                 `}
//               >
//                 <input
//                   type="file"
//                   id="file-upload"
//                   className="hidden"
//                   onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
//                   accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
//                   disabled={uploading}
//                 />
//                 <label htmlFor="file-upload" className="cursor-pointer">
//                   <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
//                     <FiUpload className="text-2xl text-slate-600" />
//                   </div>
//                   <p className="text-sm text-gray-700 font-medium mb-1">
//                     <span className="text-slate-900 font-semibold">Click to upload</span> or drag and drop
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     PDF, DOC, DOCX, PPT, PPTX, JPG, PNG (Max 10MB)
//                   </p>
//                 </label>
//               </div>
//             ) : (
//               <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
//                 <div className="flex items-center gap-2.5 flex-1 min-w-0">
//                   <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <FiFile className="text-white text-sm" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
//                     <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
//                   </div>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => setFile(null)}
//                   disabled={uploading}
//                   className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
//                 >
//                   <FiX className="text-lg" />
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Comment */}
//           <div>
//             <label className="block text-xs font-semibold text-gray-700 mb-2">
//               Comment (Optional)
//             </label>
//             <textarea
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               rows={2}
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
//               placeholder="Add any notes about your submission..."
//               disabled={uploading}
//             />
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
//               <FiX className="text-red-600 text-base flex-shrink-0 mt-0.5" />
//               <p className="text-xs text-red-700">{error}</p>
//             </div>
//           )}

//           {/* Progress Bar */}
//           {uploading && (
//             <div className="space-y-1.5">
//               <div className="flex items-center justify-between text-xs">
//                 <span className="text-gray-600 font-medium">Uploading...</span>
//                 <span className="text-slate-900 font-bold">{Math.round(progress)}%</span>
//               </div>
//               <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-slate-900 transition-all duration-300 rounded-full"
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex gap-2 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={uploading}
//               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={uploading || !file}
//               className="flex-1 px-4 py-2 bg-slate-900 text-white text-sm rounded-lg font-medium hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
//             >
//               {uploading ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   Uploading...
//                 </>
//               ) : (
//                 <>
//                   <FiCheck className="text-base" />
//                   Submit Task
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }





// client/src/app/(dashboard)/student-dashboard/task/components/SubmitTaskModal.tsx
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { submitTask, validateTaskFile } from '../../../../../../lib/task';
import { FiX, FiUpload, FiFile, FiCheck } from 'react-icons/fi';

interface SubmitTaskModalProps {
  taskId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubmitTaskModal({ taskId, onClose, onSuccess }: SubmitTaskModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (selectedFile: File) => {
    const validation = validateTaskFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      toast.error(validation.error || 'Invalid file');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      const errorMsg = 'Please select a file to upload';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      setUploading(true);
      setError('');

      await submitTask(taskId, file, comment, (prog) => setProgress(prog));
      
      toast.success('Task submitted successfully!', {
        duration: 4000,
        icon: '✅',
      });
      
      setTimeout(() => {
        onSuccess();
      }, 500);
      
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to submit task';
      setError(errorMsg);
      toast.error(errorMsg);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl animate-slideUp" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Submit Your Task</h2>
            <p className="text-xs text-gray-500 mt-0.5">Upload your assignment file</p>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Upload File *
            </label>

            {!file ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300
                  ${isDragging 
                    ? 'border-slate-900 bg-slate-50' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                  disabled={uploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
                    <FiUpload className="text-2xl text-slate-600" />
                  </div>
                  <p className="text-sm text-gray-700 font-medium mb-1">
                    <span className="text-slate-900 font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, PPT, PPTX, JPG, PNG (Max 10MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiFile className="text-white text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  disabled={uploading}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
              placeholder="Add any notes about your submission..."
              disabled={uploading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <FiX className="text-red-600 text-base flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {uploading && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Uploading...</span>
                <span className="text-slate-900 font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !file}
              className="flex-1 px-4 py-2 bg-slate-900 text-white text-sm rounded-lg font-medium hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FiCheck className="text-base" />
                  Submit Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




